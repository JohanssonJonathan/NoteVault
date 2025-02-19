import type { ITodoTables } from '../../dummyData/todoTables.ts';
import type { ITodoRow } from '../../types.d.ts';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getTableList = (): Promise<ITodoRow[]> => {
  return new Promise((resolve) => {
    const file = fs.readFileSync(
      path.resolve(__dirname, '../../dummyData/listTables.json'),
      'utf8'
    );

    const listTables = JSON.parse(file) as ITodoTables[];

    resolve(listTables);
  });
};

export default getTableList;
