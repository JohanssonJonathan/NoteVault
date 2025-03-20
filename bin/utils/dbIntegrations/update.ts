import { dbTables } from '../consts.ts';
import { db } from '../../index.ts';
import type { ICollectionRow, IList } from '../../types/types.d.ts';

export const updateCollectionName = (collectionId: number, name: string) =>
  new Promise((resolve, reject) => {
    const updateSql = `
      UPDATE ${dbTables.listCollection}
      SET name = '${name}'
      WHERE id = ${collectionId}
      RETURNING *;
     `;

    db.get(updateSql, [], (err, row) => {
      if (err) return reject(err);

      resolve(row);
    });
  });

export const updateListName = (collectionId: number, name: string) =>
  new Promise((resolve, reject) => {
    const updateSql = `
      UPDATE ${dbTables.lists}
      SET name = '${name}'
      WHERE id = ${collectionId}
      RETURNING *;
     `;

    db.get(updateSql, [], (err, row) => {
      if (err) return reject(err);

      resolve(row);
    });
  });

export const updateList = (listId: number, itemIds: number[]) =>
  new Promise<IList>((resolve, reject) => {
    const firstSql = `
SELECT items
FROM ${dbTables.lists}
WHERE id = ${listId};
`;

    db.get(firstSql, [], (err, row: { items: null | string }) => {
      if (err) return reject(false);

      let newItems = '';

      if (row.items) {
        const currentList = JSON.parse(row.items);
        newItems = JSON.stringify([...currentList, ...itemIds]);
      } else {
        newItems = JSON.stringify([...itemIds]);
      }

      const updateSql = `
     UPDATE ${dbTables.lists}
     SET items = '${newItems}'
     WHERE id = ${listId}
     RETURNING *;
    `;
      db.get(updateSql, [], (err, row: IList) => {
        if (err) return reject(false);

        resolve(row);
      });
    });
  });

export const updateCollection = (
  tableName: string,
  collectionId: number,
  listId: number,
  action: 'add' | 'delete'
) =>
  new Promise<ICollectionRow>((resolve, reject) => {
    const firstSql = `
SELECT lists
FROM ${dbTables.listCollection}
WHERE id = ${collectionId};
`;

    db.get(firstSql, [], (err, row: { lists: null | string }) => {
      if (err) return reject(false);

      let newLists = '';

      if (action === 'add') {
        if (row?.lists) {
          const currentList = JSON.parse(row.lists);
          newLists = JSON.stringify([...currentList, listId]);
        } else {
          newLists = JSON.stringify([listId]);
        }
      } else {
        // Delete from list
        const currentList = JSON.parse(row.lists as string);
        const updatedList = currentList.filter((id: number) => id !== listId);

        newLists = JSON.stringify(updatedList);
      }

      const updateSql = `
     UPDATE ${dbTables.listCollection}
     SET lists = '${newLists}'
     WHERE id = ${collectionId}
     RETURNING *;
    `;
      db.get(updateSql, [], (err, row: ICollectionRow) => {
        if (err) return reject(false);

        resolve(row);
      });
    });
  });
