import type { IListRow } from '../../types/types.d.ts';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getTableList = (): Promise<IListRow[]> => {
  return new Promise((resolve) => {
    const file = fs.readFileSync(
      path.resolve(__dirname, '../../dummyData/listTables.json'),
      'utf8'
    );

    const listTables = JSON.parse(file);

    resolve(listTables);
  });
};

export default getTableList;
