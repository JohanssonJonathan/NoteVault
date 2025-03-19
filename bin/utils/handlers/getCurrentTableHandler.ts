import { dbTables } from '../consts.ts';
import getTableNotes from '../dbIntegrations/getTableNotes.ts';
import type { TTables } from '../../types/types.d.ts';
import { getCollections } from '../dbIntegrations/getData.ts';
import { getCollectionsHandler } from './getHandler.ts';
const getCurrentTableHandler = async (tableName: TTables) => {
  return await getCollectionsHandler(tableName).then((data) => data);
};

export default getCurrentTableHandler;
