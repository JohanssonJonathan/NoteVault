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
import {
  deleteCollectionInList,
  deleteCollectionInNotes,
} from '../dbIntegrations/deleteCollection.ts';
import { deleteList, deleteNote } from '../dbIntegrations/deleteItems.ts';

interface IDeleteHandlerItems {
  tableName: TTables;
  rowId: string;
  id: string;
}

interface IDeleteHandlerCollection {
  tableName: TTables;
  rowId: string;
}

export const deleteHandlerItems = async ({
  tableName,
  rowId,
  id,
}: IDeleteHandlerItems) => {
  if (tableName === value.list) {
    return deleteList(rowId, id)
      .then((data) => {
        return data;
      })
      .catch(() => null);
  }

  return deleteNote(rowId, id);
};

export const deleteHandlerCollection = async ({
  tableName,
  rowId,
}: IDeleteHandlerCollection) => {
  if (tableName === value.list) {
    return deleteCollectionInList(rowId)
      .then((created) => created)
      .catch(() => null);
  }

  return deleteCollectionInNotes(rowId)
    .then((created) => created)
    .catch(() => null);
};
