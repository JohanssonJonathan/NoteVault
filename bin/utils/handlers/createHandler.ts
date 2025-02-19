import type { TTables } from '../../types/types.d.ts';
import { value } from '../consts.ts';
import findCollection from '../dbIntegrations/findCollection.ts';
import {
  createCollectionInList,
  createCollectionInNotes,
} from '../dbIntegrations/createCollection.ts';
import {
  createItemsInCollectionList,
  createItemsInCollectionNotes,
} from '../dbIntegrations/createItemsInCollectionList.ts';
interface ICreateHandler {
  rowName: { id?: string; value: string };
  note?: string;
  items?: string[];
}

interface ICreateHandlerItems {
  rowName: { id: string; value: string };
  note?: { title: string; note: string };
  items?: string[];
}

interface ICreateHandlerCollection {
  tableName: TTables;
  rowName: string;
}

export const createHandlerItems = async ({
  items,
  note,
  rowName,
}: ICreateHandlerItems) => {
  if (items) {
    return createItemsInCollectionList(rowName.id, items)
      .then((data) => {
        return data;
      })
      .catch(() => null);
  }

  if (note) {
    return createItemsInCollectionNotes(rowName.id, note?.title, note?.note);
  }

  Promise.resolve(null);
};

export const createHandlerCollection = async ({
  tableName,
  rowName,
}: ICreateHandlerCollection) => {
  const alreadyExist = await findCollection({ tableName, name: rowName });

  if (alreadyExist) {
    return null;
  }

  if (tableName === value.list) {
    return createCollectionInList(rowName)
      .then((created) => created)
      .catch(() => null);
  }

  return createCollectionInNotes(rowName)
    .then((created) => created)
    .catch(() => null);
};

const createHandler = async ({
  tableName,
  items,
  note,
  rowName,
}: ICreateHandler) => {
  // if an item exist then we know that the collection already exist.
  //  but we need an existing collection id
  if (rowName.id && (items || note)) {
    if (items) {
      return createItemsInCollectionList(rowName.id, items)
        .then((data) => ({
          created: data,
          data: {
            tableName,
            rowName,
            items,
          },
        }))
        .catch(() => null);
    }

    return null;
  }

  const alreadyExist = await findCollection({ tableName, name: rowName.value });

  if (alreadyExist) {
    return null;
  }

  if (tableName === value.list) {
    return createCollectionInList(rowName.value)
      .then((created) => ({
        created,
        data: { tableName },
      }))
      .catch(() => null);
  }

  return createCollectionInNotes(rowName.value)
    .then((created) => ({
      created,
      data: { tableName },
    }))
    .catch(() => null);
};

export default createHandler;
