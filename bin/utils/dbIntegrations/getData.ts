import { db } from '../../index.ts';
import type {
  TTables,
  ICollectionRow,
  IListItem,
  IList,
} from '../../types/types.d.ts';
import { message, dbTables } from '../consts.ts';
import { combineQueries } from './dbUtils.ts';

export const getTableExistence = (tableName: string) =>
  new Promise((resolve) => {
    const sql = `SELECT name
FROM sqlite_master
WHERE type = 'table' AND name = '${tableName}';`;
    // const sql = `SELECT name FROM ${tableName}`;

    db.get(sql, [], (err, row) => {
      if (err) return resolve(false);

      if (row) {
        return resolve(message[1]);
      }

      return resolve(undefined);
    });
  });

export const getListExcistenceById = (id: number) =>
  new Promise<IList>((resolve, reject) => {
    const sql = `SELECT * FROM ${dbTables.lists}
WHERE id = '${id}';
    `;

    db.get(sql, [], (err, row: IList) => {
      if (err) return reject(false);

      if (row) {
        return resolve(row);
      }

      return reject(false);
    });
  });

export const getCollectionExistenceById = (tableName: string, id: number) =>
  new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ${tableName}
WHERE id = '${id}';
    `;

    db.get(sql, [], (err, row) => {
      if (err) return reject(false);

      if (row) {
        return resolve(message[1]);
      }

      return resolve(message[2]);
    });
  });

export const getListExistenceRelatedToCollectionByName = (
  collectionId: number,
  listName: string
) =>
  new Promise((resolve, reject) => {
    combineQueries(
      () => {},
      (err) => {
        if (err) return reject(false);

        resolve(true);
      }
    );
    const sql = `SELECT * FROM ${dbTables.lists}
WHERE name = '${name}';
    `;

    db.get(sql, [], (err, row) => {
      if (err) return reject(false);

      if (row) {
        return resolve(message[1]);
      }

      return resolve(undefined);
    });
  });

export const getCollectionExistenceByName = (tableName: string, name: string) =>
  new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ${tableName}
WHERE name = '${name}';
    `;

    db.get(sql, [], (err, row) => {
      if (err) return reject(false);

      if (row) {
        return resolve(message[1]);
      }

      return resolve(undefined);
    });
  });

export const getCollection = (tableName: string, id: number) =>
  new Promise<ICollectionRow>((resolve, reject) => {
    const sql = `
SELECT *
FROM ${tableName}
WHERE id = ${id};
      `;

    db.get(sql, [], (err, row: ICollectionRow) => {
      if (err) return reject(false);

      if (row) return resolve(row);

      reject(message[2]);
    });
  });
// Get all collections with the specific tableName
export const getCollections = (tableName: TTables, ids?: number[]) =>
  new Promise<ICollectionRow[]>((resolve, reject) => {
    const idsString = ids?.join(',');

    const sql = ids?.length
      ? `
SELECT *
FROM ${tableName}
WHERE id IN (${idsString});
      `
      : `SELECT * FROM ${tableName}`;

    db.all(sql, [], (err, row: ICollectionRow[]) => {
      console.log('err: ', err);
      if (err) return reject(false);

      return resolve(row);
    });
  });

export const getListItems = (ids?: number[]) =>
  new Promise<IListItem[]>((resolve, reject) => {
    const idsString = ids?.join(',');

    const sql = ids?.length
      ? `
SELECT *
FROM listItems
WHERE id IN (${idsString});
      `
      : `SELECT * FROM listItems`;

    db.all(sql, [], (err, row: IListItem[]) => {
      if (err) return reject(false);

      return resolve(row);
    });
  });

export const getList = (id: number) =>
  new Promise<IList>((resolve, reject) => {
    const sql = `
SELECT *
FROM lists
WHERE id = ${id};
      `;

    db.get(sql, [], (err, row: IList) => {
      if (err) return reject(false);

      return resolve(row);
    });
  });

// Either get all lists or the lists with the speciefied ids
export const getLists = (ids?: number[]) =>
  new Promise<IList[]>((resolve, reject) => {
    const idsString = ids?.join(',');

    const sql = ids?.length
      ? `
SELECT *
FROM lists
WHERE id IN (${idsString})
      `
      : `SELECT * FROM lists`;

    db.all(sql, [], (err, row: IList[]) => {
      if (err) return reject(false);

      return resolve(row);
    });
  });
