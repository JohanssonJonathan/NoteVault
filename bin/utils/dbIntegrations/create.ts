import type {
  TTables,
  ICollectionRow,
  IList,
  IListItem,
} from '../../types/types.d.ts';
import { db } from '../../index.ts';

export const createTable = (query: string) =>
  new Promise((resolve) => {
    return db.run(query, [], (err) => {
      if (err) resolve(false);
      resolve(true);
    });
  });

export const createCollection = (
  tableName: string,
  values: { name: string; created: Date }
) =>
  new Promise<ICollectionRow | false>((resolve, reject) => {
    const { name, created } = values;
    const sql = `
INSERT INTO ${tableName} (name, created, lists) 
VALUES (?, ?, ?)
RETURNING *;
    `;

    return db.get(sql, [name, created, null], (err, row: ICollectionRow) => {
      if (err) reject(false);

      return resolve(row);
    });
  });

export const createList = (values: { name: string; created: Date }) =>
  new Promise<IList | false>((resolve, reject) => {
    const { name, created } = values;
    const sql = `
INSERT INTO lists (name, created, items) 
VALUES (?, ?, ?)
RETURNING *;
    `;

    return db.get(sql, [name, created, null], (err, row: IList) => {
      if (err) {
        return reject(false);
      }

      resolve(row);
    });
  });

// interface IListItem {
//   id: string;
//   name: string;
//   created: Date;
//   modified?: Date;
//   link?: string;
//   isDone?: boolean;
// }
export const createListItems = (items: Omit<IListItem, 'id'>[]) =>
  new Promise<IListItem[] | false>((resolve, reject) => {
    const currentValues = items
      .map((item) => {
        const link = item.link ? `"${item.link}"` : null;
        const isDone =
          typeof item.isDone === 'boolean' ? Number(item.isDone) : null;
        const baseValues = `"${item.name}", "${item.created}", ${link}, ${isDone}`;

        return `(${baseValues})`;
      })
      .join(',');

    const sql = `
     INSERT INTO listItems (name, created, link, isDone)
     VALUES ${currentValues}
     RETURNING *;
    `;

    db.all(sql, [], (err, value: IListItem[]) => {
      if (err) {
        return reject(false);
      }

      resolve(value);
    });
  });
