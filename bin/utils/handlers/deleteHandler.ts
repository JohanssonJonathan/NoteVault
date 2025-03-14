import type { IList, TTables } from '../../types/types.d.ts';
import { message, value } from '../consts.ts';
import {
  deleteCollectionInList,
  deleteCollectionInNotes,
} from '../dbIntegrations/deleteCollection.ts';
import { deleteNote, deleteListItem } from '../dbIntegrations/deleteItems.ts';
import { getCollection, getLists, getList } from '../dbIntegrations/getData.ts';
import {
  deleteCollection,
  deleteItems,
  deleteList,
} from '../dbIntegrations/delete.ts';
import { captureRejections } from 'events';
import { updateCollection } from '../dbIntegrations/update.ts';

interface IDeleteHandlerItems {
  tableName: TTables;
  rowId: string;
  id: string;
}

interface IDeleteHandlerCollection {
  tableName: TTables;
  rowId: string;
}

export const deleteHandlerListItem = async ({
  tableName,
  rowId,
  listId,
  id,
}: any) => {
  return deleteListItem({ rowId, listId, id });
};
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

const getListsHelper = (ids: number[]): Promise<IList | false> =>
  getLists(ids)
    .then((result) => result)
    .catch((err) => err);

export const deleteListHandler = async (
  collectionId: number,
  listId: number
) => {
  const currentCollection = await getCollection(value.list, collectionId);

  if (typeof currentCollection === 'string') {
    return message[2];
  }

  if (!currentCollection || !currentCollection.lists) return currentCollection;

  const listContent = await getList(listId).catch((err) => err);

  if (!listContent) return listContent;

  const itemIds = listContent.items ? JSON.parse(listContent.items) : [];

  return deleteList(
    { id: collectionId, lists: currentCollection.lists },
    listId,
    itemIds
  );
};

// needs to delete list collection an everything related to it.
export const deleteListCollectionHandler = async (id: number) => {
  const currentCollection = await getCollection(value.list, id).then(
    (result) => {
      if (result === false) {
        return getCollection(value.list, id);
      }
      return result;
    }
  );

  if (!currentCollection) return currentCollection;

  if (typeof currentCollection === 'string') {
    return message[2];
  }

  const listIds: number[] = JSON.parse(currentCollection.lists || '[]');
  const listsContent = (await getListsHelper(listIds).then(
    (result) => result || []
  )) as IList[];

  const itemIds: number[] = listsContent
    .map((list: IList) => (list.items ? JSON.parse(list.items) : false))
    .filter((items) => items)
    .flat();

  return deleteCollection(id, listIds, itemIds).catch((err) => err);
};
