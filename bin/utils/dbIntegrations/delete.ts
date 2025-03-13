import { db } from '../../index.ts';
import { value } from '../consts.ts';
export const deleteCollection = (id: number) =>
  new Promise((resolve) => {
    const sql = `
DELETE FROM ${value.list}
WHERE id = ${id}
    `;

    db.run(sql, [], (err) => {
      if (err) return resolve(false);

      resolve(true);
    });
  });

export const deleteLists = (ids: number[]) =>
  new Promise((resolve) => {
    const idsString = ids?.join(',');

    const sql = `
     DELETE FROM lists   
     WHERE id IN (${idsString});
    `;

    db.run(sql, [], (err) => {
      if (err) return resolve(false);

      resolve(true);
    });
  });

export const deleteItems = (ids: number[]) =>
  new Promise((resolve) => {
    const idsString = ids?.join(',');

    const sql = `
     DELETE FROM listItems  
     WHERE id IN (${idsString});
    `;

    db.run(sql, [], (err) => {
      if (err) return resolve(err);

      resolve(true);
    });
  });
