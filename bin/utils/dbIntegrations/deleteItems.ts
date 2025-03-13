import type {
  IList,
  IListItem,
  IListRow,
  INoteRow,
} from '../../types/types.d.ts';

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const deleteListItem = ({ rowId, listId, id }: any) => {
  return new Promise<{ deletedItem: IListItem; listItems: IListItem[] }>(
    (resolve, reject) => {
      const relativePath = '../../dummyData/listTables.json';
      const file = fs.readFileSync(
        path.resolve(__dirname, relativePath),
        'utf8'
      );

      const parsedFile = JSON.parse(file);

      const {
        deletedItem,
        listItems,
      }: { deletedItem: IListItem; listItems: IListItem[] } = parsedFile.reduce(
        (prev: IListItem, value: IListRow) => {
          if (value.id === rowId) {
            const foundList = value.lists.find((list) => list.id === listId);
            if (foundList) {
              const foundItem = foundList.items.find((item) => item.id === id);
              return {
                deletedItem: foundItem,
                listItems: foundList.items.filter((item) => item.id !== id),
              };
            }
          }

          return prev;
        },
        { deletedItem: undefined, listItems: [] }
      );

      const updatedList = parsedFile.map((value: IListRow) => {
        if (value.id === rowId) {
          return {
            ...value,
            lists: value.lists.map((list) => {
              if (list.id === listId) {
                return {
                  ...list,
                  items: list.items.filter((item) => item.id !== id),
                };
              }

              return list;
            }),
          };
        }

        return value;
      });

      try {
        fs.writeFileSync(
          path.resolve(__dirname, relativePath),
          JSON.stringify(updatedList)
        );
        resolve({ deletedItem, listItems });
      } catch {
        reject();
      }
    }
  );
};

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
      (list: IList) => list.id === listId
    );
    const updatedList = parsedFile.map((value: IListRow) => {
      if (value.id === rowId) {
        return {
          ...value,
          lists: value.lists.filter((list) => list.id !== listId),
        };
      }

      return value;
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
