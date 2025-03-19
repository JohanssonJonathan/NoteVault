import type {
  ICollectionRow,
  IList,
  IListItem,
  TTables,
} from '../../types/types.d.ts';
import { dbTables, message } from '../consts.ts';
import {
  getCollections,
  getLists,
  getList,
  getListItems,
  getCollection,
} from '../dbIntegrations/getData.ts';
import { errorMessage, successfullMesage } from '../logMessages.ts';

export const getCollectionsHandler = async (
  tableName: TTables,
  ids?: number[]
) =>
  new Promise<ICollectionRow[]>(async (resolve, reject) => {
    return getCollections(tableName, ids)
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  }).catch(() => {
    errorMessage('Something went wrong with getting the collections');
    process.exit();
  });
export const getListHandler = (id: number) =>
  new Promise<IList>((resolve, reject) => {
    getList(id)
      .then((result) => resolve(result))
      .catch(reject);
  }).catch(() => {
    errorMessage('Something went wrong with getting the list');
    process.exit();
  });
export const getListsHandler = async (ids?: number[]) => {
  return await getLists(ids);
};

export const getListItemsHandler = async (ids: number[]) => {
  return await getListItems(ids);
};

export const getListItemsRelatedToListHandler = (listId: number) =>
  new Promise<IListItem[]>(async (resolve, reject) => {
    const currentList = await getList(listId).catch(reject);

    if (currentList && typeof currentList === 'object' && !currentList.items) {
      return resolve([]);
    }

    if (currentList && typeof currentList === 'object' && currentList.items) {
      const { items } = currentList;
      const itemIds: number[] = JSON.parse(items);

      return getListItems(itemIds)
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    }

    reject();
  }).catch((error: Error) => {
    if (error.message === message[2]) {
      errorMessage('list doenst exist');
    } else {
      errorMessage('Something went wrong with getting the listItems');
    }
    process.exit();
  });

export const getListsRelatedToListCollection = (collectionId: number) =>
  new Promise<IList[]>(async (resolve, reject) => {
    const currentCollection = await getCollection(
      dbTables.listCollection,
      collectionId
    ).catch(reject);

    if (
      currentCollection &&
      typeof currentCollection === 'object' &&
      !currentCollection.lists
    ) {
      return resolve([]);
    }

    if (
      currentCollection &&
      typeof currentCollection === 'object' &&
      currentCollection.lists
    ) {
      const { lists } = currentCollection;
      const listIds = JSON.parse(lists);

      return await getLists(listIds)
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    }

    reject();
  }).catch((error: Error) => {
    if (error.message === message[2]) {
      errorMessage('Collection doenst exist');
    }
    errorMessage('Something went wrong with getting the lists');

    process.exit();
  });
