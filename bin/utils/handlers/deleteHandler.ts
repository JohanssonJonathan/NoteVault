import type { ICollectionRow, IList } from '../../types/types.d.ts';
import { dbTables, message, value } from '../consts.ts';
import { getCollection, getLists, getList } from '../dbIntegrations/getData.ts';
import {
  deleteCollection,
  deleteItem,
  deleteItems,
  deleteList,
} from '../dbIntegrations/delete.ts';
import { errorMessage, successfullMesage } from '../logMessages.ts';

const getListsHelper = (ids: number[]): Promise<IList | false> =>
  getLists(ids)
    .then((result) => result)
    .catch((err) => err);

// Delete one item from a list
export const deleteItemHandler = async (listId: number, itemId: number) => {
  const listContent = await getList(listId).catch(() => false);

  if (!listContent || typeof listContent === 'boolean') return listContent;

  const itemIds = listContent.items ? JSON.parse(listContent.items) : [];

  if (itemIds.length === 0) {
    return false;
  }

  const itemsIdsAsString = listContent.items as string;
  return deleteItem({ id: listId, items: itemsIdsAsString }, itemId);
};

// Delete all items from a list
export const deleteItemsHandler = async (listId: number) => {
  const listContent = await getList(listId).catch(() => false);

  if (!listContent || typeof listContent === 'boolean') return listContent;

  const itemIds = listContent.items ? JSON.parse(listContent.items) : [];

  if (itemIds.length === 0) {
    return false;
  }

  const itemsIdsAsString = listContent.items as string;
  return deleteItems({ id: listId, items: itemsIdsAsString }, itemIds);
};

// Delete a list and all its items
export const deleteListHandler = async (
  collectionId: number,
  listId: number
) => {
  const currentCollection = await getCollection(
    dbTables.listCollection,
    collectionId
  );

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
  ).catch((result) => result);
};

// needs to delete list collection an everything related to it.
export const deleteListCollectionHandler = async (id: number) =>
  new Promise(async (resolve, reject) => {
    const currentCollection = (await getCollection(value.list, id).catch(
      (err) => {
        reject(err);
      }
    )) as ICollectionRow;

    const listIds: number[] = JSON.parse(currentCollection.lists || '[]');
    const listsContent = (await getListsHelper(listIds).then(
      (result) => result || []
    )) as IList[];

    const itemIds: number[] = listsContent
      .map((list: IList) => (list.items ? JSON.parse(list.items) : false))
      .filter((items) => items)
      .flat();

    return deleteCollection(id, listIds, itemIds).then(resolve).catch(reject);
  })
    .then((result) => {
      successfullMesage('Removed list collection');
      return result;
    })
    .catch((error) => {
      if (error === message[2]) {
        errorMessage('Collection doesnt exist');
      } else {
        errorMessage('Something went wrong with deleting the collection');
      }

      process.exit();
    });
