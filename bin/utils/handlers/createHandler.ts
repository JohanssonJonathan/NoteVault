import type {
  ICollectionRow,
  IListItem,
  TTables,
} from '../../types/types.d.ts';
import { message, value } from '../consts.ts';
import findCollection from '../dbIntegrations/findCollection.ts';
import {
  createCollectionInList,
  createCollectionInNotes,
} from '../dbIntegrations/createCollection.ts';
import {
  createItemsInCollectionList,
  createItemsInCollectionNotes,
} from '../dbIntegrations/createItemsInCollectionList.ts';
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
interface ICreateHandlerItems {
  rowName: { id: string; value: string };
  note?: { title: string; note: string };
  items?: string[];
  id?: string;
}

interface ICreateHandlerCollection {
  tableName: TTables;
  rowName: string;
}

export const createHandlerItems = async ({
  items,
  note,
  rowName,
  id,
}: ICreateHandlerItems) => {
  if (items) {
    return createItemsInCollectionList(rowName.id, items, id)
      .then((data) => {
        return data;
      })
      .catch(() => null);
  }

  if (note) {
    return createItemsInCollectionNotes(rowName.id, note?.title, note?.note);
  }

  Promise.resolve(null);
};

// export const createHandlerCollection = async ({
//   tableName,
//   rowName,
// }: ICreateHandlerCollection) => {
//   const alreadyExist = await findCollection({ tableName, name: rowName });
//
//   if (alreadyExist) {
//     return null;
//   }
//
//   if (tableName === value.list) {
//     return createCollectionInList(rowName)
//       .then((created) => created)
//       .catch(() => null);
//   }
//
//   return createCollectionInNotes(rowName)
//     .then((created) => created)
//     .catch(() => null);
// };

export const createListItemsHandler = async (
  listId: number,
  items: Omit<IListItem, 'id'>[]
) => {
  const listExist = await getListExcistenceById(listId).then((result) => {
    if (result === false) {
      return getListExcistenceById(listId);
    }
    return result;
  });

  if (listExist === message[2]) {
    return message[2];
  }

  if (!listExist) {
    return listExist;
  }

  // first create the items
  const createdItems = await createListItems(items).then((result) => {
    if (result === false) {
      return createListItems(items);
    }
    return result;
  });

  if (createdItems) {
    return updateList(
      listId,
      createdItems.map((item) => item.id)
    ).then((result) => {
      if (result === false) {
        return updateList(
          listId,
          createdItems.map((item) => item.id)
        );
      }

      return {
        items: createdItems,
        list: result,
      };
    });
  }

  return createdItems;
};

export const createListHandler = async (
  collectionId: number,
  listName: string
) => {
  const collectionExist = await getCollectionExistenceById(
    value.list,
    collectionId
  ).then((result) => {
    if (result === false) {
      return getCollectionExistenceById(value.list, collectionId);
    }
    return result;
  });

  if (collectionExist === message[2]) {
    return message[2];
  }

  if (!collectionExist) {
    return collectionExist;
  }

  const list = await createList({
    name: listName,
    created: new Date(),
  }).then((result) => {
    if (result === false) {
      return createList({ name: listName, created: new Date() });
    }
    return result;
  });

  // add the newly listId in the related collection.
  if (list) {
    return updateCollection(value.list, collectionId, list.id, 'add').then(
      (result) => {
        if (result === false) {
          return updateCollection(value.list, collectionId, list.id, 'add');
        }

        return {
          list,
          collection: result,
        };
      }
    );
  }

  return list;
};
export const createCollectionHandler = async (
  tableName: TTables,
  collectionName: string
): Promise<ICollectionRow | false | string> => {
  const collectionExist = await getCollectionExistenceByName(
    tableName,
    collectionName
  ).then((result) => {
    if (result === false) {
      console.log('Something went wrong with getting the collection');
      // lets try one more time
      return getCollectionExistenceByName(tableName, collectionName);
    }
    // doesnt exist
    return result;
  });

  if (collectionExist === message[1]) {
    return message[1] as string;
  }

  const collection = await createCollection(tableName, {
    name: collectionName,
    created: new Date(),
  }).then((result) => {
    if (!result) {
      console.log('Something went wrong with creating the collection');
      // lets try one more time
      return createCollection(tableName, {
        name: collectionName,
        created: new Date(),
      });
    }

    return result;
  });

  return collection;
};

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
