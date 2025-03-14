#!/usr/bin/env node

import { inititalQuestion } from './utils/questions/initialQuestion.ts';
import type { TInitialQuestionSelection } from './utils/questions/initialQuestion.ts';
import getCurrentTableHandler from './utils/handlers/getCurrentTableHandler.ts';
import type {
  TTables,
  IList,
  IListRow,
  INoteRow,
  IListItem,
} from './types/types.d.ts';
import emptyTableFlow from './utils/questionsFlow/emptyTableFlow.ts';
import { actions } from './utils/consts.ts';
import questionSelectRow from './utils/questions/questionSelectRow.ts';
import { deleteCollectionFlow } from './utils/questionsFlow/deleteCollectionFlow.ts';
import { value } from './utils/consts.ts';
import showCollectionFlow from './utils/questionsFlow/showCollectionFlow.ts';
import showListsFlow from './utils/questionsFlow/showListsFlow.ts';
import { deleteItemsFlow } from './utils/questionsFlow/deleteItemsFlow.ts';
import inputQuestion from './utils/questions/inputQuestion.ts';
import createNewCollectionFlow from './utils/questionsFlow/createNewCollectionFlow.ts';
import pickCollectionFlow from './utils/questionsFlow/pickCollectionFlow.ts';
import writeItemsFlow from './utils/questionsFlow/writeItemsFlow.ts';
import { deleteHandlerListItem } from './utils/handlers/deleteHandler.ts';
import { updateHandlerListItem } from './utils/handlers/updateHandler.ts';
import writeListItemsFlow from './utils/questionsFlow/writeListItemsFlow.ts';
import updateListItemsFlow from './utils/questionsFlow/updateListItemsFlow.ts';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import sqlite3 from 'sqlite3';
import {
  createCollectionHandler,
  createListHandler,
  createListItemsHandler,
  createTableHandler,
} from './utils/handlers/createHandler.ts';
import {
  deleteListCollectionHandler,
  deleteListHandler,
} from './utils/handlers/deleteHandler.ts';
import { getCollections } from './utils/dbIntegrations/getData.ts';
import { getListsRelatedToListCollection } from './utils/handlers/getHandler.ts';
import { createListItems } from './utils/dbIntegrations/create.ts';
const argv = yargs(hideBin(process.argv)).argv;
const sqlLite = sqlite3.verbose();
export const db = new sqlLite.Database('sqlite.db', (err) => {
  if (err) return console.log('err: ', err);

  console.log('no error');
});
// const items = [
//   { name: 'Koda', created: 1222 },
//   { name: 'Testa', created: 1223 },
// ];
// createItemsInListHandler(8, items);
// getListsRelatedToCollection(1).then((result) =>
//   console.log('result: ', result)
// );
// getCollectionsHandler(value.list, [1, 2]).then((result) =>
//   console.log('result: ', result)
// );

// First create all the tables if they dont exist in the database.
createTableHandler(value.list).then((data) =>
  console.log('created listCollection: ', data)
);

createTableHandler('lists').then((data) =>
  console.log('created lists: ', data)
);

createTableHandler('listItems').then((data) =>
  console.log('created listItems: ', data)
);

// getListsRelatedToListCollection(1).then((result) =>
//   console.log('result: ', result)
// );

// deleteListCollectionHandler(4).then((result) => console.log('result', result));

// deleteListHandler(4, 9).then((result) => console.log('result: ', result));
// CREATE COLLECTION
// createCollectionHandler(value.list, 'Second coll').then((result) =>
//   console.log('result: ', result)
// );

// Create first list
// createListHandler(4, 'En annan list').then((result) =>
//   console.log('result: ', result)
// );

// const items = [
//   {
//     name: 'tredje',
//     created: new Date(),
//     link: 'javascript.se',
//   },
// ]; // Create first listItems
// //
// createListItemsHandler(3, items);

const items = [
  {
    name: 'ifran 9',
    created: new Date(),
    link: 'https://www.google.se',
  },
];
// Craete items
// createListItemsHandler(9, items).then((result) =>
//   console.log('result: ', result)
// );

const sqlGetListCollection = `SELECT * FROM listCollection;`;
const sqlGetLists = `SELECT * FROM lists;`;
const sqlGetListItems = `SELECT * FROM listItems;`;

db.all(sqlGetListCollection, [], (err, row: any) => {
  if (err) return console.log('err: ', err);

  console.log('rows collection: ', row);
});

db.all(sqlGetLists, [], (err, row: any) => {
  if (err) return console.log('err: ', err);

  console.log('lists', row);
});
db.all(sqlGetListItems, [], (err, row: any) => {
  if (err) return console.log('err: ', err);

  console.log('listItems: ', row);
});
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
  };
};

export const updatePreviousAnswers = ({
  tableName: newTableName,
  rowName: newRowName,
  list: newList,
  listItem: newListItem,
}: {
  tableName?: TTables;
  rowName?: { id?: number; value?: string };
  list?: IList;
  listItem?: IListItem;
}) => {
  tableName = newTableName || tableName;
  rowName = newRowName || rowName;
  list = newList || list;
  listItem = newListItem || listItem;
};

// updates on the flow depending on what the user answer
// Fir
// inititalQuestion(argv, user)
//   // Handle the answer and find the specific table. At the moment there are two tables.
//   // List and Notes
//   .then((answer: TInitialQuestionSelection) => {
//     updatePreviousAnswers({ tableName: answer.value });
//     action = answer.action;
//
//     return getCurrentTableHandler(answer.value);
//   })
//   .then(async (data) => {
//     console.log('data: ', data);
//     if (data.length === 0) {
//       return emptyTableFlow();
//     }
//
//     //
//     // if (action === actions.write) {
//     //   return pickCollectionFlow(data)
//     //     .then(async (answer) => {
//     //       if (answer.id === 'new') {
//     //         return createNewCollectionFlow();
//     //       }
//     //
//     //       updatePreviousAnswers({
//     //         rowName: { id: answer.id, value: answer.value },
//     //       });
//     //       return true;
//     //     })
//     //     .then(() => writeItemsFlow());
//     // }
//     //
//     // //Shows all the notes/lists in the selected rowName(colletion)
//     // return showCollectionFlow(data)
//     //   .then(() => {
//     //     const choices: {
//     //       name: string;
//     //       value: { id: string; value: string };
//     //     }[] = [
//     //       {
//     //         name: 'Create new list inside collection',
//     //         value: { id: actions.write, value: actions.write },
//     //       },
//     //       {
//     //         name: `Delete ${rowName.value} collection`,
//     //         value: { id: actions.delete, value: actions.delete },
//     //       },
//     //     ];
//     //
//     //     const value = data.find(({ id }) => id === rowName.id);
//     //
//     //     const listRow = value as IListRow;
//     //     const itemsRow = value as INoteRow;
//     //
//     //     if (listRow?.lists?.length || itemsRow?.notes?.length) {
//     //       choices.push({
//     //         name: `Show items inside ${rowName.value} collection`,
//     //         value: { id: actions.read, value: actions.read },
//     //       });
//     //     }
//     //     //Decide if you want to delete the specific rowName or show a note/list in that collection.
//     //     return questionSelectRow(
//     //       'Create, delete or show more inside collection',
//     //       choices
//     //     );
//     //   })
//     //   .then((answer) => {
//     //     if (answer.value === actions.delete) {
//     //       return deleteCollectionFlow().then(() => {
//     //         process.exit();
//     //       });
//     //     }
//     //
//     //     if (answer.value === actions.write) {
//     //       return writeListItemsFlow({}).then(() => {
//     //         process.exit();
//     //       });
//     //     }
//     //
//     //     return;
//     //   })
//     //   .then(() => {
//     //     if (tableName === value.list) {
//     //       return showListsFlow({ data })
//     //         .then(() =>
//     //           questionSelectRow('Either modify or delete', [
//     //             {
//     //               name: 'Add new items in list',
//     //               value: { id: actions.write, value: actions.write },
//     //             },
//     //             {
//     //               name: 'Update current items in list',
//     //               value: { id: actions.read, value: actions.read },
//     //             },
//     //             {
//     //               name: 'Delete selected list',
//     //               value: { id: actions.delete, value: actions.delete },
//     //             },
//     //           ])
//     //         )
//     //         .then(async (answer) => {
//     //           if (answer.id === actions.write) {
//     //             return writeItemsFlow(list.id);
//     //           }
//     //           if (answer.id === actions.delete) {
//     //             return deleteItemsFlow().then(() => {
//     //               process.exit();
//     //             });
//     //           }
//     //
//     //           return updateListItemsFlow();
//     //         })
//     //         .then(() => {
//     //           process.exit();
//     //         });
//     //     }
//     //
//     //     // const noteRow = currentRow as INoteRow;
//     //     // return questionSelectRow({
//     //     //   choices: noteRow.notes.map(({ id, title }) => ({
//     //     //     name: title,
//     //     //     value: { id, value: title },
//     //     //   })),
//     //     //   question: 0,
//     //     // });
//     //   })
//     //   .then((answer) => {
//     //     console.log('answer: ', answer);
//     //   })
//     //   .catch((error) => {
//     //     console.log('exit now!: ', error);
//     //     process.exit();
//     //   });
//   });
//
// // emptyTableFlow('note');
