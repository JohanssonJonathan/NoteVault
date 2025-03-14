import type { IList, IListItem, IListRow } from '../../types/types.d.ts';
import { value } from '../consts.ts';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import { db } from '../../index.ts';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const updateListItem = ({ rowId, listId, id, value }: any) => {
  return new Promise<{ listItem?: IListItem; listItems: IListItem[] }>(
    (resolve, reject) => {
      const relativePath = '../../dummyData/listTables.json';
      const file = fs.readFileSync(
        path.resolve(__dirname, relativePath),
        'utf8'
      );

      const parsedFile = JSON.parse(file);

      let listItems: IListItem[] = [];
      const updatedList = parsedFile.map((row: IListRow) => {
        if (row.id === rowId) {
          return {
            ...row,
            lists: row.lists.map((list) => {
              if (list.id === listId) {
                listItems = list.items.map((item) =>
                  item.id === id ? { ...item, name: value } : item
                );
                return {
                  ...list,
                  items: listItems,
                };
              }

              return list;
            }),
          };
        }

        return row;
      });

      try {
        fs.writeFileSync(
          path.resolve(__dirname, relativePath),
          JSON.stringify(updatedList)
        );
        resolve({
          listItems,
          listItem: listItems.find(({ id: itemId }) => itemId === id),
        });
      } catch {
        reject();
      }
    }
  );
};

export const updateListItems = ({ rowId, listId, items }: any) => {
  return new Promise((resolve, reject) => {
    const relativePath = '../../dummyData/listTables.json';
    const file = fs.readFileSync(path.resolve(__dirname, relativePath), 'utf8');

    const parsedFile = JSON.parse(file);
    const currentCollection = parsedFile.find(
      (row: IListRow) => row.id === rowId
    );

    const currentList = currentCollection.lists.find(
      (list: IList) => list.id === listId
    );
    const updatedList = parsedFile.map((row: IListRow) => {
      if (row.id === rowId) {
        return {
          ...row,
          lists: row.lists.map((list) => {
            if (list.id === listId) {
              console.log('in db: ', items);
              return {
                ...list,
                items: [...items, ...list.items],
              };
            }

            return list;
          }),
        };
      }

      return row;
    });

    try {
      fs.writeFileSync(
        path.resolve(__dirname, relativePath),
        JSON.stringify(updatedList)
      );
      resolve(currentList);
    } catch {
      reject();
    }
  });
};

export const updateList = (listId: number, itemIds: number[]) =>
  new Promise((resolve) => {
    const firstSql = `
SELECT items
FROM lists
WHERE id = ${listId};
`;

    db.get(firstSql, [], (err, row: { items: null | string }) => {
      if (err) return resolve(false);

      let newItems = '';

      if (row.items) {
        const currentList = JSON.parse(row.items);
        newItems = JSON.stringify([...currentList, ...itemIds]);
      } else {
        newItems = JSON.stringify([...itemIds]);
      }

      const updateSql = `
     UPDATE lists
     SET items = '${newItems}'
     WHERE id = ${listId}
     RETURNING *;
    `;
      db.get(updateSql, [], (err, row) => {
        if (err) return resolve(false);

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
  new Promise((resolve, reject) => {
    const firstSql = `
SELECT lists
FROM ${value.list}
WHERE id = ${collectionId};
`;

    db.get(firstSql, [], (err, row: { lists: null | string }) => {
      if (err) return resolve(false);

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
     UPDATE ${tableName}
     SET lists = '${newLists}'
     WHERE id = ${collectionId}
     RETURNING *;
    `;
      db.get(updateSql, [], (err, row) => {
        if (err) return reject(false);

        resolve(row);
      });
    });
  });
