import { db } from '../../index.ts';

export const combineQueries = <T>(
  callback: () => void,
  commitCallback: (err: Error, row?: T) => void,
  commitValue: 'run' | 'get' | 'all' = 'run'
) => {
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    callback();

    db[commitValue]('COMMIT', commitCallback);
  });
};
