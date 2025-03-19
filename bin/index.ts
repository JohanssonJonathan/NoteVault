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
import { getCollectionsHandler } from './utils/handlers/getHandler.ts';
import writeListsFlow from './utils/questionsFlow/writeListsFlow/index.ts';
import readListsFlow from './utils/questionsFlow/readListsFlow/index.ts';
import createNewCollectionFlow from './utils/questionsFlow/createNewCollectionFlow.ts';
import questionSelectRow from './utils/questions/questionSelectRow.ts';
import { deleteListCollectionHandler } from './utils/handlers/deleteHandler.ts';
import { getListsRelatedToListCollection } from './utils/handlers/getHandler.ts';
import confirmQuestion from './utils/questions/confirmQuestion.ts';
import chalk from 'chalk';
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

let tableName: TTables;
let rowName: { id?: number; value?: string } = {};
let list: IList;
let listItem: IListItem;
let action: typeof actions.read | typeof actions.delete | typeof actions.write;


export const getPreviousAnswers = () => {
  return {
    tableName,
    rowName,
    list,
    listItem,
    action,
  };
};

export const updatePreviousAnswers = ({
  tableName: newTableName,
  rowName: newRowName,
  list: newList,
  listItem: newListItem,
  action: newAction,
}: {
  tableName?: TTables;
  rowName?: { id?: number; value?: string };
  list?: IList;
  listItem?: IListItem;
  action?: typeof actions.read | typeof actions.delete | typeof actions.write;
}) => {
  tableName = newTableName || tableName;
  rowName = newRowName || rowName;
  list = newList || list;
  listItem = newListItem || listItem;
  action = newAction || action;
};

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
          ]).then(async (answer) => {
            if (answer.action === actions.delete) {
              return deleteListCollectionHandler(rowName.id as number);
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
            return questionSelectRow('What do you want to delete?', choices);
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
