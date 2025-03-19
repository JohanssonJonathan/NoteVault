import type {
  ICollectionRow,
  IList,
  IListItem,
  TTables,
} from '../../types/types.d.ts';
import { message, value } from '../consts.ts';
import {
  getCollectionExistenceById,
  getCollectionExistenceByName,
  getListExcistenceById,
  getTableExistence,
} from '../dbIntegrations/getData.ts';
import {
  createTable,
  createCollection,
  createList,
} from '../dbIntegrations/create.ts';
import { updateCollection, updateList } from '../dbIntegrations/update.ts';
import { createListItems } from '../dbIntegrations/create.ts';
import { errorMessage, successfullMesage } from '../logMessages.ts';

export const createListItemsHandler = async (
  listId: number,
  items: Omit<IListItem, 'id'>[]
) =>
  new Promise(async (resolve, reject) => {
    await getListExcistenceById(listId).catch(reject);
    // first create the items
    const createdItems = await createListItems(items).catch(reject);

    if (createdItems) {
      return updateList(
        listId,
        createdItems.map((item) => item.id)
      )
        .then((result) => {
          return resolve({
            items: createdItems,
            list: result,
          });
        })
        .catch((result) => {
          return reject({
            items: createdItems,
            list: result,
          });
        });
    }

    return reject(false);
  })
    .then((result) => {
      successfullMesage('Created items');

      return result;
    })
    .catch((error) => {
      if (typeof error === 'object') {
        errorMessage('Could not update the list with the new items');
      } else {
        errorMessage('Something went wrong with creating the items');
      }

      process.exit();
    });

export const createListHandler = async (
  collectionId: number,
  listName: string
) =>
  new Promise<{ list: IList; collection: ICollectionRow }>(
    async (resolve, reject) => {
      const collectionExist = await getCollectionExistenceById(
        value.list,
        collectionId
      ).catch((result) => result);

      if (collectionExist === message[2]) {
        reject(message[2]);
      }

      if (!collectionExist) {
        reject();
      }

      const list = await createList({
        name: listName,
        created: new Date(),
      }).catch((result) => result);

      // add the newly listId in the related collection.
      if (list) {
        return updateCollection(value.list, collectionId, list.id, 'add')
          .then((result) => {
            return resolve({
              list,
              collection: result,
            });
          })
          .catch((result) => {
            return reject({
              list,
              collection: result,
            });
          });
      }

      reject();
    }
  )
    .then((result) => {
      successfullMesage(
        `${result.list.name} was created in ${result.collection.name} collection`
      );
      return result;
    })
    .catch((error: Error) => {
      if (error.message === message[2]) {
        console.log('Collection doenst exist');
      } else {
        console.log('Something went wrong with creating the list');
      }
      process.exit();
    });

export const createCollectionHandler = async (
  tableName: string,
  collectionName: string
) =>
  new Promise<ICollectionRow>(async (resolve, reject) => {
    const collectionExist = await getCollectionExistenceByName(
      tableName,
      collectionName
    ).catch((err) => reject(err));

    if (collectionExist === message[1]) {
      reject(message[1]);
    }

    const collection = (await createCollection(tableName, {
      name: collectionName,
      created: new Date(),
    }).catch((err) => reject(err))) as ICollectionRow;

    return resolve(collection);
  })
    .then((result) => {
      successfullMesage(`${result.name} was created!`);

      return result;
    })
    .catch((error: Error) => {
      if (error.message === message[2]) {
        console.log('Collection doenst exist');
      }

      console.log('Something went wrong with creating the list');
      process.exit();
    });

export const createTableHandler = async (tableName: string) => {
  // Check first if table already exist;
  const tableExist = await getTableExistence(tableName).then((result) => {
    if (result === false) {
      console.log('Something went wrong with getting the table');
      // lets try one more time
      return getTableExistence(tableName);
    }
    // doesnt exist
    return result;
  });

  if (tableExist === message[1]) {
    return message[1];
  }

  let currentQuery = `CREATE TABLE ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100),
    created DATETIME,
    lists STRING NULL,
    FOREIGN KEY (lists) REFERENCES lists(id)
   );`;

  if (tableName === 'lists') {
    currentQuery = `CREATE TABLE ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100),
    created DATETIME,
    modified DATETIME NULL,
    items STRING NULL,
    FOREIGN KEY (items) REFERENCES items(id)
   );`;
  }

  if (tableName === 'listItems') {
    currentQuery = `CREATE TABLE ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100),
    created DATETIME,
    modified DATETIME NULL,
    link STRING NULL,
    isDone BOOLEAN null
   );`;
  }

  const created = await createTable(currentQuery).then((result) => {
    if (result === false) {
      console.log('Something went wrong with creating the table');
      // lets try one more time
      return createTable(currentQuery);
    }
    // created successfully
    return result;
  });

  return created;
};
