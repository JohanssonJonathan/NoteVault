import type { IListItem, IListRow, INoteRow } from '../../types/types.d.ts';

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const deleteList = (
  rowId: string,
  listId: string
): Promise<IListRow[]> => {
  return new Promise((resolve, reject) => {
    const relativePath = '../../dummyData/listTables.json';
    const file = fs.readFileSync(path.resolve(__dirname, relativePath), 'utf8');

    const parsedFile = JSON.parse(file);
    const currentCollection = parsedFile.find(
      (value: IListRow) => value.id === rowId
    );

    console.log('currentCollection: ', currentCollection);

    console.log('listid: ', listId);
    const currentList = currentCollection.lists.find(
      (list: IListItem) => list.id === listId
    );
    const updatedList = parsedFile.map((value: IListRow) => {
      if (value.id === rowId) {
        return {
          ...value,
          lists: value.lists.filter((list) => list.id !== listId),
        };
      }
    });

    console.log('parsedFile: ', parsedFile);
    console.log('currentList: ', currentList);
    try {
      fs.writeFileSync(
        path.resolve(__dirname, relativePath),
        JSON.stringify(updatedList)
      );
      resolve(currentList);
    } catch {
      reject();
    }
  });
};

export const deleteNote = (
  rowId: string,
  noteId: string
): Promise<INoteRow[]> => {
  return new Promise((resolve, reject) => {
    // const relativePath = '../../dummyData/notesTablesJson.json';
    //
    // const file = fs.readFileSync(path.resolve(__dirname, relativePath), 'utf8');
    //
    // const parsedFile = JSON.parse(file);
    // const deletedCollection = parsedFile.find(
    //   (value: INoteRow) => value.id === id
    // );
    // const updatedList = parsedFile.filter((value: INoteRow) => value.id !== id);
    //
    // try {
    //   fs.writeFileSync(
    //     path.resolve(__dirname, relativePath),
    //     JSON.stringify(updatedList)
    //   );
    //   resolve(deletedCollection);
    // } catch {
    //   reject();
    // }
  });
};
