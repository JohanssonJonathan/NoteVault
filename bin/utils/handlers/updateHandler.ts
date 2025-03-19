import { dbTables, message } from '../consts.ts';
import {
  getCollectionExistenceById,
  getListExcistenceById,
} from '../dbIntegrations/getData.ts';
import {
  updateCollectionName,
  updateListName,
} from '../dbIntegrations/update.ts';

export const updateListCollectionNameHandler = async (
  collectionId: number,
  name: string
) => {
  // First check if the collection exist.
  const collectionExist = await getCollectionExistenceById(
    dbTables.listCollection,
    collectionId
  ).catch((result) => result);

  if (!collectionExist || collectionExist === message[2])
    return collectionExist;

  // the collection exist. We can not update the name
  return updateCollectionName(collectionId, name).catch((result) => result);
};

export const updateListNameHandler = async (listId: number, name: string) => {
  const listExist = await getListExcistenceById(listId).catch(
    (result) => result
  );

  if (!listExist || listExist === message[2]) return listExist;

  return updateListName(listId, name).catch((result) => result);
};
