import { notesTables } from '../../dummyData/notesTables.ts';
import type { INotesTables } from '../../dummyData/notesTables.ts';
import { todoTables } from '../../dummyData/todoTables.ts';
import type { ITodoTables } from '../../dummyData/todoTables.ts';
import { v4 as uuidv4 } from 'uuid';

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ICreatedListItem {
  id: string;
  created: Date;
  items?: { id: string; name: string }[];
}

export interface ICreatedNoteItem {
  id: string;
  created: Date;
  title: string;
  note: string;
}

export const createItemsInCollectionList = (
  rowId: string,
  items: string[],
  id?: string
): Promise<null | ICreatedListItem> => {
  return new Promise((resolve, reject) => {
    const relativePath = '../../dummyData/listTables.json';

    const file = fs.readFileSync(path.resolve(__dirname, relativePath), 'utf8');

    const listTables = JSON.parse(file) as ITodoTables[];

    const newItemList = {
      id: uuidv4(),
      created: new Date(),
      items: items.map((item) => ({ id: uuidv4(), name: item })),
    };

    const updatedList = listTables.map((list) => {
      if (list.id === rowId) {
        const test = id
          ? list.lists.map((list) => {
              if (list.id === id) {
                return {
                  ...list,
                  items: [
                    ...items.map((item) => ({ id: uuidv4(), name: item })),
                    ...list.items,
                  ],
                };
              }
            })
          : [newItemList, ...list.lists];
        return {
          ...list,
          lists: test,
        };
      }
      return list;
    });

    console.log('updated list: ', updatedList);
    try {
      fs.writeFileSync(
        path.resolve(__dirname, relativePath),
        JSON.stringify(updatedList)
      );
      if (id) {
        return resolve(updatedList);
      }
      resolve(newItemList);
    } catch {
      reject(null);
    }
  });
};

export const createItemsInCollectionNotes = (
  rowId: string,
  title: string,
  note: string
): Promise<ICreatedNoteItem | null> => {
  return new Promise((resolve, reject) => {
    const relativePath = '../../dummyData/notesTablesJSON.json';
    const file = fs.readFileSync(path.resolve(__dirname, relativePath), 'utf8');

    const notesTables = JSON.parse(file);

    const newItem = {
      id: uuidv4(),
      title,
      created: new Date(),
      note,
    };

    const updatedList = notesTables.map((note) => {
      if (note.id === rowId) {
        return {
          ...note,
          notes: [newItem, ...note.notes],
        };
      }
    });

    try {
      fs.writeFileSync(
        path.resolve(__dirname, relativePath),
        JSON.stringify(updatedList)
      );
      resolve(updatedList);
    } catch {
      reject(null);
    }
  });
};
