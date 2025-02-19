import { value } from '../consts.ts';
import type { ITodoTables } from '../../dummyData/todoTables.ts';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface IFindCollection {
  name: string;
  tableName: string;
}

const findCollection = ({ name, tableName }: IFindCollection): Promise<any> => {
  // should be handled in db later
  return new Promise((resolve) => {
    if (tableName === value.list) {
      const file = fs.readFileSync(
        path.resolve(__dirname, '../../dummyData/listTables.json'),
        'utf8'
      );

      const listTables = JSON.parse(file) as ITodoTables[];

      console.log('listTables: ', listTables);
      const alreadyExist = listTables.find(
        ({ name: existingName }) =>
          existingName.toLowerCase() === name.toLowerCase()
      );

      if (alreadyExist) {
        resolve(true);
      } else {
        resolve(null);
      }
    }

    const file = fs.readFileSync(
      path.resolve(__dirname, '../../dummyData/notesTablesJSON.json'),
      'utf8'
    );

    const notesTables = JSON.parse(file) as ITodoTables[];

    console.log('notesTables: ', notesTables);
    const alreadyExist = notesTables.find(
      ({ name: existingName }) =>
        existingName.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExist) {
      resolve(true);
    } else {
      resolve(null);
    }
  });
};

export default findCollection;
