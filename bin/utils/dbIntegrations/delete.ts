import { db } from '../../index.ts';
import { dbTables } from '../consts.ts';
import { combineQueries } from './dbUtils.ts';

const deleteBySeveralIds = (
  ids: number[],
  table: string,
  callback: (err: Error) => void
) => {
  const idsString = ids?.join(',');

  const sql = `
         DELETE FROM ${table} 
         WHERE id IN (${idsString});
    `;

  db.run(sql, [], callback);
};

const deleteById = (
  id: number,
  table: string,
  callback: (err: Error) => void
) => {
  const sql = `
         DELETE FROM ${table}
         WHERE id = ${id}
        `;

  db.run(sql, [], callback);
};

const updateParentReference = (
  id: number,
  table: string,
  updatedReferences: number[],
  callback: (err: Error) => void
) => {
  const newValue = updatedReferences.length
    ? `'${JSON.stringify(updatedReferences)}'`
    : 'NULL';

  const updateSql = `
    UPDATE ${table}
    SET ${table === dbTables.listCollection ? 'lists' : 'items'} = ${newValue}
    WHERE id = ${id}
    `;

  db.run(updateSql, [], callback);
};

export const deleteList = (
  collection: { id: number; lists: string },
  listId: number,
  itemIds: number[]
) =>
  new Promise((resolve, reject) => {
    combineQueries(
      () => {
        // Delete items related to the list id
        deleteBySeveralIds(itemIds, dbTables.listItems, (err) => {
          if (err) return reject(err);
        });

        // Delete the list
        deleteById(listId, dbTables.lists, (err) => {
          if (err) return reject(false);
        });

        // Update the collection
        const currentList = JSON.parse(collection.lists as string);
        const updatedList = currentList.filter((id: number) => id !== listId);

        updateParentReference(
          collection.id,
          dbTables.listCollection,
          updatedList,
          (err) => {
            if (err) return reject(false);
          }
        );
      },
      (err) => {
        if (err) return reject(false);

        resolve(true);
      }
    );
  });

export const deleteCollection = (
  collectionId: number,
  listIds: number[],
  itemIds: number[]
) =>
  new Promise((resolve, reject) => {
    combineQueries(
      () => {
        // Delete items related to the list id
        deleteBySeveralIds(itemIds, dbTables.listItems, (err) => {
          if (err) return reject(err);
        });

        // Delete lists rows with ids
        deleteBySeveralIds(listIds, dbTables.lists, (err) => {
          if (err) return reject(err);
        });

        // Delete the collection
        deleteById(collectionId, dbTables.listCollection, (err) => {
          if (err) return reject(false);
        });
      },
      (err) => {
        if (err) return reject(false);

        resolve(true);
      }
    );
  });

export const deleteLists = (
  collection: {
    id: number;
    lists: string;
  },
  listIds: number[],
  itemIds: number[]
) =>
  new Promise((resolve, reject) => {
    combineQueries(
      () => {
        // Delete items related to the list id
        deleteBySeveralIds(itemIds, dbTables.listItems, (err) => {
          if (err) return reject(err);
        });

        // Delete the list
        deleteBySeveralIds(listIds, dbTables.lists, (err) => {
          if (err) return reject(err);
        });

        const currentList = JSON.parse(collection.lists as string);
        const updatedList = currentList.filter(
          (id: number) => !listIds.includes(id)
        );

        updateParentReference(
          collection.id,
          dbTables.listCollection,
          updatedList,
          (err) => {
            if (err) return reject(false);
          }
        );
      },
      (err) => {
        if (err) return reject(false);

        resolve(true);
      }
    );
  });

export const deleteItem = (
  list: { id: number; items: string },
  itemToRemove: number
) =>
  new Promise((resolve, reject) => {
    combineQueries(
      () => {
        deleteById(itemToRemove, dbTables.listItems, (err) => {
          if (err) return reject('Cant delete by id');
        });

        const currentItems = JSON.parse(list.items as string);
        const updatedItems = currentItems.filter(
          (id: number) => itemToRemove !== id
        );

        updateParentReference(list.id, dbTables.lists, updatedItems, (err) => {
          console.log('err: ', err);
          if (err) return reject('Cant update parent reference with new items');
        });
      },
      (err) => {
        if (err) return reject(false);

        resolve(true);
      }
    );
  });

export const deleteItems = (
  list: { id: number; items: string },
  itemsToRemove: number[]
) =>
  new Promise((resolve, reject) => {
    combineQueries(
      () => {
        deleteBySeveralIds(itemsToRemove, dbTables.listItems, (err) => {
          if (err) return reject(err);
        });

        const currentItems = JSON.parse(list.items as string);
        const updatedItems = currentItems.filter(
          (id: number) => !itemsToRemove.includes(id)
        );

        updateParentReference(list.id, dbTables.lists, updatedItems, (err) => {
          if (err) return reject(false);
        });
      },
      (err) => {
        if (err) return reject(false);

        resolve(true);
      }
    );
  });
