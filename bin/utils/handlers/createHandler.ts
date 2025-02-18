import type { TTables } from '../../types.d.ts';
import { value } from '../consts.ts';
import findCollection from '../dbIntegrations/findCollection.ts';
import {
  createCollectionInList,
  createCollectionInNotes,
} from '../dbIntegrations/createCollection.ts';

interface ICreateHandler {
  tableName: TTables;
  collectionId?: string;
  name: string;
  item?: string;
}

const createHandler = async ({
  tableName,
  name,
  item,
  collectionId,
}: ICreateHandler) => {
  // if an item exist then we know that the collection already exist.
  //  but we need an existing collection id
  if (item && collectionId) {
    // first we need to make sure that the same name doesnt exist in the same collection
    //  create item

    return null;
  }

  const alreadyExist = await findCollection({ tableName, name });

  if (alreadyExist) {
    return null;
  }

  if (tableName === value.list) {
    return createCollectionInList(name).then((created) => ({
      created,
      data: { tableName },
    }));
  }

  return createCollectionInNotes(name).then((created) => ({
    created,
    data: { tableName },
  }));
};

export default createHandler;
