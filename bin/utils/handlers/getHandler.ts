import type { TTables } from '../../types/types.d.ts';
import { message, value } from '../consts.ts';
import {
  getCollections,
  getLists,
  getList,
  getListItems,
  getCollection,
} from '../dbIntegrations/getData.ts';

export const getCollectionsHandler = async (
  tableName: TTables,
  ids?: number[]
) => {
  return await getCollections(tableName, ids);
};

export const getListsHandler = async (ids: number[]) => {
  return await getLists(ids);
};

export const getListItemsHandler = async (ids: number[]) => {
  return await getListItems(ids);
};

export const getListItemsRelatedToList = async (listId: number) => {
  const currentList = await getList(listId).then((result) => {
    if (result === false) {
      return getList(listId);
    }

    return result;
  });

  // the list doesnt exist
  if (currentList === message[2]) {
    return message[2];
  }

  if (currentList && typeof currentList === 'object' && currentList.items) {
    const { items } = currentList;
    const itemIds: number[] = JSON.parse(items);

    return await getLists(itemIds);
  }

  return false;
};

export const getListsRelatedToListCollection = async (collectionId: number) => {
  const currentCollection = await getCollection(value.list, collectionId).then(
    (result) => {
      if (result === false) {
        return getCollection(value.list, collectionId);
      }

      return result;
    }
  );

  // the collection doesnt exist
  if (currentCollection === message[2]) {
    return message[2];
  }

  if (
    currentCollection &&
    typeof currentCollection === 'object' &&
    currentCollection.lists
  ) {
    const { lists } = currentCollection;
    const listIds = JSON.parse(lists);

    console.log('list ids : ', listIds);
    return await getLists(listIds);
  }

  return false;
};
