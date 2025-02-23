import type { IListRow, INoteRow } from '../../types/types.d.ts';

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const deleteCollectionInList = (id: string): Promise<IListRow[]> => {
  return new Promise((resolve, reject) => {
    const relativePath = '../../dummyData/listTables.json';
    const file = fs.readFileSync(path.resolve(__dirname, relativePath), 'utf8');

    const parsedFile = JSON.parse(file);
    const deletedCollection = parsedFile.find(
      (value: IListRow) => value.id === id
    );
    const updatedList = parsedFile.filter((value: IListRow) => value.id !== id);

    try {
      fs.writeFileSync(
        path.resolve(__dirname, relativePath),
        JSON.stringify(updatedList)
      );
      resolve(deletedCollection);
    } catch {
      reject();
    }
  });
};

export const deleteCollectionInNotes = (id: string): Promise<INoteRow[]> => {
  return new Promise((resolve, reject) => {
    const relativePath = '../../dummyData/notesTablesJson.json';

    const file = fs.readFileSync(path.resolve(__dirname, relativePath), 'utf8');

    const parsedFile = JSON.parse(file);
    const deletedCollection = parsedFile.find(
      (value: INoteRow) => value.id === id
    );
    const updatedList = parsedFile.filter((value: INoteRow) => value.id !== id);

    try {
      fs.writeFileSync(
        path.resolve(__dirname, relativePath),
        JSON.stringify(updatedList)
      );
      resolve(deletedCollection);
    } catch {
      reject();
    }
  });
};
