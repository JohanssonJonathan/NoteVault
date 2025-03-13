import type { TTables } from '../../types/types.d.ts';
import { message, value } from '../consts.ts';
import {
  deleteCollectionInList,
  deleteCollectionInNotes,
} from '../dbIntegrations/deleteCollection.ts';
import {
  deleteList,
  deleteNote,
  deleteListItem,
} from '../dbIntegrations/deleteItems.ts';
import { getCollection, getLists } from '../dbIntegrations/getData.ts';
import {
  deleteCollection,
  deleteLists,
  deleteItems,
} from '../dbIntegrations/delete.ts';
import { captureRejections } from 'events';

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

  // If the doesnt have any lists its safe to delete it.
  // Otherwise it needs to delete those first.
  if (currentCollection.lists === null) {
    // DELETE IT
    return deleteCollection(id).then((result) => {
      if (result === false) {
        return deleteCollection(id);
      }
      return result;
    });
  }

  const lists = JSON.parse(currentCollection.lists);
  const currentLists = await getLists(lists).then((result) => {
    if (result === false) return getLists(lists);

    return result;
  });

  if (currentLists === false) {
    return currentLists;
  }

  if (currentLists.length === 0) {
    return false;
  }

  const listIds = currentLists.map((list) => list.id);
  // Now we need to go through all currentLists and see if they have items.
  // If they have items we need to remove those first, before we remove the list.
  const itemIds = currentLists
    .map((list) => {
      if (list.items) {
        return JSON.parse(list.items);
      }

      return false;
    })
    .filter((value) => value)
    .flat();

  // Delete each item first
  if (itemIds.length) {
    const deletedItems = await deleteItems(itemIds).then((result) => {
      if (result === false) {
        return deleteItems(itemIds);
      }
      return result;
    });

    // could not delete items
    if (!deletedItems) return deletedItems;
  }

  if (listIds) {
    const deletedLists = await deleteLists(listIds).then((result) => {
      if (result === false) {
        return deleteLists(listIds);
      }
      return result;
    });

    if (!deletedLists) return deletedLists;
  }

  return deleteCollection(id).then((result) => {
    if (result === false) {
      return deleteCollection(id);
    }
    return result;
  });
};
