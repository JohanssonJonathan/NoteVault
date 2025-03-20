#!/usr/bin/env node

import { inititalQuestion } from './utils/questions/initialQuestion.ts';
import type { TTables, IList, IListItem } from './types/types.d.ts';
import emptyTableFlow from './utils/questionsFlow/emptyTableFlow.ts';
import { actions, dbTables } from './utils/consts.ts';
import pickCollectionFlow from './utils/questionsFlow/pickCollectionFlow.ts';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import sqlite3 from 'sqlite3';
import { createTableHandler } from './utils/handlers/createHandler.ts';
import {
  getCollectionsHandler,
  getListItemsRelatedToListHandler,
} from './utils/handlers/getHandler.ts';
import writeListsFlow from './utils/questionsFlow/writeListsFlow/index.ts';
import readListsFlow from './utils/questionsFlow/readListsFlow/index.ts';
import createNewCollectionFlow from './utils/questionsFlow/createNewCollectionFlow.ts';
import questionSelectRow from './utils/questions/questionSelectRow.ts';
import { deleteListCollectionHandler } from './utils/handlers/deleteHandler.ts';
import { getListsRelatedToListCollection } from './utils/handlers/getHandler.ts';
import confirmQuestion from './utils/questions/confirmQuestion.ts';
import chalk from 'chalk';
import {
  deleteListHandler,
  deleteItemHandler,
} from './utils/handlers/deleteHandler.ts';
import { getListHandler } from './utils/handlers/getHandler.ts';
import { arg } from './utils/consts.ts';
import { getCollections } from './utils/dbIntegrations/getData.ts';

export const argv = yargs(hideBin(process.argv))
  .options({
    collection: { type: 'string' },
    action: { type: 'string' },
  })
  .parseSync();
const { USER } = process.env;

const user = USER
  ? USER.charAt(0).toUpperCase() + USER.substring(1, USER.length)
  : undefined;

let tableName: TTables | undefined;
let rowName: { id?: number; value?: string } = {};
let list: IList | undefined;
let listItems: IListItem[] | undefined;
let action:
  | typeof actions.read
  | typeof actions.delete
  | typeof actions.write
  | undefined;

let programArguments = {
  area: argv[arg.area],
  collection: argv[arg.collection],
  list: argv[arg.list],
  action: argv[arg.action],
};

export const getPreviousArguments = () => ({
  area: programArguments.area,
  collection: programArguments.collection,
  list: programArguments.list,
  action: programArguments.action,
});

export const updateArguments = ({
  area,
  collection,
  list,
  action,
}: {
  area?: string;
  collection?: string;
  list?: string;
  action?: string;
}) => {
  programArguments = {
    area,
    collection,
    list,
    action,
  };
};

export const getPreviousAnswers = () => {
  return {
    tableName,
    rowName,
    list,
    listItems,
    action,
  };
};

export const clearAnswers = ({
  tableName: isTableClear,
  rowName: isRowClear,
  list: isListClear,
  listItems: isItemsClear,
  action: isActionClear,
}: {
  tableName?: true;
  rowName?: true;
  list?: true;
  listItems?: true;
  action?: true;
}) => {
  tableName = isTableClear ? undefined : tableName;
  rowName = isRowClear ? {} : rowName;
  list = isListClear ? undefined : list;
  listItems = isItemsClear ? undefined : listItems;
  action = isActionClear ? undefined : action;
};

export const updatePreviousAnswers = ({
  tableName: newTableName,
  rowName: newRowName,
  list: newList,
  listItems: newListItems,
  action: newAction,
}: {
  tableName?: TTables;
  rowName?: { id?: number; value?: string };
  list?: IList;
  listItems?: IListItem[];
  action?: typeof actions.read | typeof actions.delete | typeof actions.write;
}) => {
  tableName = newTableName || tableName;
  rowName = newRowName || rowName;
  list = newList || list;
  listItems = newListItems || listItems;
  action = newAction || action;
};

export interface IArguments {
  area?: string;
  collection?: string;
  list?: string;
  action?: string;
}
const startQuestions = () =>
  inititalQuestion(user)
    .then(async (answer) => {
      updatePreviousAnswers({ tableName: answer.value, action: answer.action });

      return await getCollectionsHandler(answer.value);
    })
    .then(async (data) => {
      const { action } = getPreviousAnswers();
      if (data.length === 0) {
        return emptyTableFlow();
      }

      return pickCollectionFlow(data).then(async (answer) => {
        if (answer.id && answer.value) {
          updatePreviousAnswers({
            rowName: { id: answer.id, value: answer.value },
          });
        }

        if (answer.value === 'quit') {
          process.exit();
        }

        if (action === actions.read) {
          return readListsFlow(answer);
        }

        if (action === actions.write) {
          if (answer.new) {
            return createNewCollectionFlow();
          }

          return writeListsFlow(answer);
        }

        if (action === actions.delete) {
          return questionSelectRow(`Delete ${answer.value} collection?`, [
            {
              name: 'Yes!',
              value: { action: actions.delete, value: answer.value },
            },
            {
              name: `No I want to delete someting inside '${answer.value}' collection`,
              value: { value: answer.value },
            },
          ])
            .then(async (answer) => {
              if (answer.action === actions.delete) {
                return deleteListCollectionHandler(rowName.id as number).then(
                  async () => {
                    const collections = await getCollectionsHandler(
                      dbTables.listCollection
                    );
                    clearAnswers({ rowName: true });
                    updateArguments({
                      area: 'list',
                      action:
                        collections.length > 0 ? actions.delete : undefined,
                    });
                    startQuestions();
                  }
                );
              }

              const lists = await getListsRelatedToListCollection(
                rowName.id as number
              );

              if (lists.length === 0) {
                return confirmQuestion(
                  chalk.red(
                    `There are no lists inside ${rowName.value}. Do you want to delete the collection anyway?`
                  )
                ).then(async (answer) => {
                  if (answer) {
                    return deleteListCollectionHandler(rowName.id as number);
                  }
                  process.exit();
                });
              }

              // Delete list
              const choices = lists.map((list) => ({
                name: list.name,
                value: { id: list.id, value: list.name },
              }));

              return questionSelectRow('Pick list', choices);
            })
            .then(async (answer) => {
              if (answer === undefined) return;
              const list = await getListHandler(answer.id);
              const items = await getListItemsRelatedToListHandler(list.id);

              updatePreviousAnswers({ list, listItems: items });

              if (items.length === 0) {
                return confirmQuestion(`Delete ${answer.value} list?`);
              }

              return questionSelectRow(`Delete ${answer.value} list?`, [
                {
                  name: 'Yes!',
                  value: true,
                },
                {
                  name: `No I want to delete someting inside '${answer.value}' list`,
                  value: false,
                },
              ]);
            })
            .then(async (answer) => {
              if (answer === undefined) return;

              const { list, listItems } = getPreviousAnswers();
              if (answer) {
                return deleteListHandler(rowName.id as number, list.id);
              }

              if (listItems.length === 0) {
                process.exit();
              }

              const choices = listItems.map((item) => ({
                name: item.name,
                value: { id: item.id, value: item.name },
              }));

              return questionSelectRow(`Delete an item in ${list.name}`, [
                ...choices,
              ]);
            })
            .then(async (answer) => {
              if (answer === undefined) return;

              return confirmQuestion(
                `Are you sure you want to delete ${answer.value}?`
              ).then((confirm) => {
                if (confirm) {
                  return deleteItemHandler(list.id, answer.id);
                }

                process.exit();
              });
            });
        }
      });
    });

const sqlLite = sqlite3.verbose();

export const db = new sqlLite.Database('sqlite.db', (err) => {
  if (err) return console.log('err: ', err);

  startQuestions();
});

// Create all the tables
createTableHandler(dbTables.listCollection);
createTableHandler(dbTables.lists);
createTableHandler(dbTables.listItems);

const items = [
  {
    name: 'ifran 9',
    created: new Date(),
    link: 'https://www.google.se',
  },
];

const sqlGetListCollection = `SELECT * FROM listCollection;`;
const sqlGetLists = `SELECT * FROM lists;`;
const sqlGetListItems = `SELECT * FROM listItems;`;
