import { value } from '../consts.ts';
import getTableNotes from '../dbIntegrations/getTableNotes.ts';
import type { TTables } from '../../types/types.d.ts';
import { getCollections } from '../dbIntegrations/getData.ts';

const getCurrentTableHandler = async (tableName: TTables) => {
  if (value.list === tableName) {
    // get everything related to "list" from the DB

    return await getCollections(tableName).then((data) => data);
  }

  return await getTableNotes().then((data) => data);
};

export default getCurrentTableHandler;
