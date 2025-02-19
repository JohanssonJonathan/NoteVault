import type { INotesRow } from '../../types.d.ts';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getTableNotes = (): Promise<INotesRow[]> => {
  return new Promise((resolve) => {
    const relativePath = '../../dummyData/notesTablesJson.json';

    const file = fs.readFileSync(path.resolve(__dirname, relativePath), 'utf8');

    const notesTables = JSON.parse(file);
    resolve(notesTables);
  });
};

export default getTableNotes;
