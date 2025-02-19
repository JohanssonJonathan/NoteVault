import { value } from '../consts.ts';
import getTableList from '../dbIntegrations/getTableList.ts';
import getTableNotes from '../dbIntegrations/getTableNotes.ts';
import type { TTables } from '../../types/types.d.ts';

const getCurrentTableHandler = async (tableName: TTables) => {
  if (value.list === tableName) {
    // get everything related to "list" from the DB

    return await getTableList().then((data) => data);
  }

  return await getTableNotes().then((data) => data);
};

export default getCurrentTableHandler;
