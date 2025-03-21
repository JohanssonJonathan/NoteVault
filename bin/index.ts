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
import { getListsRelatedToListCollection } from './utils/handlers/getHandler.ts';
import confirmQuestion from './utils/questions/confirmQuestion.ts';
import { deleteListHandler } from './utils/handlers/deleteHandler.ts';
import { arg } from './utils/consts.ts';
import deleteListsFlow from './utils/questionsFlow/deleteListsFlow.ts';
import { deleteItemsFlow } from './utils/questionsFlow/deleteItemsFlow.ts';
import deleteCollectionFlow from './utils/questionsFlow/deleteCollectionFlow.ts';
import { errorMessage } from './utils/logMessages.ts';

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
let lists: IList[] | undefined;
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
  listItem: argv[arg.listItem],
  action: argv[arg.action],
};

export const getPreviousArguments = () => ({
  area: programArguments.area,
  collection: programArguments.collection,
  list: programArguments.list,
  action: programArguments.action,
  listItem: programArguments.listItem,
});

export const updateArguments = ({
  area,
  collection,
  list,
  action,
  listItem,
}: {
  area?: string;
  collection?: string;
  list?: string;
  action?: string;
  listItem?: string;
}) => {
  programArguments = {
    area,
    collection,
    list,
    listItem,
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
    lists,
  };
};

export const clearAnswers = ({
  tableName: isTableClear,
  rowName: isRowClear,
  list: isListClear,
  listItems: isItemsClear,
  action: isActionClear,
  lists: isListsClear,
}: {
  tableName?: true;
  rowName?: true;
  list?: true;
  listItems?: true;
  action?: true;
  lists?: true;
}) => {
  tableName = isTableClear ? undefined : tableName;
  rowName = isRowClear ? {} : rowName;
  list = isListClear ? undefined : list;
  listItems = isItemsClear ? undefined : listItems;
  action = isActionClear ? undefined : action;
  lists = isListsClear ? undefined : lists;
};

export const updatePreviousAnswers = ({
  tableName: newTableName,
  rowName: newRowName,
  list: newList,
  listItems: newListItems,
  action: newAction,
  lists: newLists,
}: {
  tableName?: TTables;
  rowName?: { id?: number; value?: string };
  list?: IList;
  listItems?: IListItem[];
  action?: typeof actions.read | typeof actions.delete | typeof actions.write;
  lists?: IList[];
}) => {
  tableName = newTableName || tableName;
  rowName = newRowName || rowName;
  list = newList || list;
  listItems = newListItems || listItems;
  action = newAction || action;
  lists = newLists || lists;
};

export interface IArguments {
  area?: string;
  collection?: string;
  list?: string;
  action?: string;
}
export const startQuestions = () =>
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
          const { list: listArgument, listItem: listItemArgument } =
            getPreviousArguments();

          const lists = await getListsRelatedToListCollection(
            rowName.id as number
          );

          updatePreviousAnswers({ lists });

          if (listArgument === '*') {
            if (lists.length) return deleteListsFlow();

            errorMessage(`No lists found in ${rowName.value} collection`);
            process.exit();
          }

          if (listArgument) {
            const foundByArgument = lists.find(
              (list) => list.name === listArgument
            );

            if (!foundByArgument) {
              errorMessage(`No list named ${listArgument}`);
              process.exit();
            }

            updatePreviousAnswers({ list: foundByArgument });

            const items = await getListItemsRelatedToListHandler(
              foundByArgument.id
            );

            if (listItemArgument === '*') {
              if (items.length) {
                updatePreviousAnswers({ listItems: items });
                return deleteItemsFlow();
              }

              errorMessage(`No items found in ${listArgument} list`);
              process.exit();
            }

            if (listItemArgument) {
              const foundItemByArgument = items.find(
                (item) => item.name === listItemArgument
              );

              if (foundItemByArgument) {
                return confirmQuestion(`Do you want to delete ${foundItemByArgument.name} item`);
              }

              errorMessage(
                `No item named ${listItemArgument} inside ${listArgument} list`
              );
              process.exit();
            }

            return confirmQuestion(
              `Are you sure you want to delete ${foundByArgument.name}?`
            ).then((confirm) => {
              if (confirm) {
                const listLengthBeforeDeleting = Number(lists?.length);
                return deleteListHandler(
                  rowName.id as number,
                  foundByArgument.id
                ).then(() => {
                  clearAnswers({ list: true });
                  updateArguments({
                    area: 'list',
                    collection: rowName.value as string,
                    list: '*',
                    action:
                      listLengthBeforeDeleting > 1 ? actions.delete : undefined,
                  });
                  startQuestions();
                });
              }

              clearAnswers({ list: true, listItems: true });
              updateArguments({
                area: 'list',
                collection: rowName.value as string,
                list: '*',
                action: actions.delete,
              });
              startQuestions();
            });
          }

          return deleteCollectionFlow(answer).then((message) => {
            if (message === 'delete lists')
              return deleteListsFlow().then((message) => {
                if (message === 'delete items') {
                  return deleteItemsFlow();
                }
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
