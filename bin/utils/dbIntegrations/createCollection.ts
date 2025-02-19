// import { notesTables } from '../../dummyData/notesTables.ts';
import type { INotesTables } from '../../dummyData/notesTables.ts';
import { todoTables } from '../../dummyData/todoTables.ts';
import type { ITodoTables } from '../../dummyData/todoTables.ts';
import { v4 as uuidv4 } from 'uuid';

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createCollectionInList = (name: string): Promise<ITodoTables> => {
  return new Promise((resolve, reject) => {
    const relativePath = '../../dummyData/listTables.json';
    const file = fs.readFileSync(path.resolve(__dirname, relativePath), 'utf8');

    const listTables = JSON.parse(file) as ITodoTables[];

    const newItem = {
      id: uuidv4(),
      name: name,
      created: new Date(),
      lists: [],
    };
    listTables.push(newItem);

    try {
      fs.writeFileSync(
        path.resolve(__dirname, relativePath),
        JSON.stringify(listTables)
      );
      resolve(newItem);
    } catch {
      reject();
    }
  });
};

export const createCollectionInNotes = (
  name: string
): Promise<INotesTables> => {
  return new Promise((resolve, reject) => {
    const relativePath = '../../dummyData/notesTablesJson.json';

    const file = fs.readFileSync(path.resolve(__dirname, relativePath), 'utf8');

    const notesTables = JSON.parse(file);
    const newItem = {
      id: uuidv4(),
      name: name,
      created: new Date(),
      notes: [],
    };
    notesTables.push(newItem);

    try {
      fs.writeFileSync(
        path.resolve(__dirname, relativePath),
        JSON.stringify(notesTables)
      );
      resolve(newItem);
    } catch {
      reject();
    }
  });
};
