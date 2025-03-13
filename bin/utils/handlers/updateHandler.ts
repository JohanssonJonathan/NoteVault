import { updateListItem, updateListItems } from '../dbIntegrations/update.ts';
import { value as constValue } from '../consts.ts';
import { v4 as uuidv4 } from 'uuid';

export const updateHandlerListItem = async ({
  tableName,
  rowId,
  listId,
  id,
  value,
}: any) => {
  return updateListItem({ rowId, listId, id, value });
};

export const updateHandlerListItems = async ({
  tableName,
  rowId,
  listId,
  items,
}: any) => {
  if (tableName === constValue.list) {
    return updateListItems({
      rowId,
      listId,
      items: items.map((item: string) => ({ id: uuidv4(), name: item })),
    });
  }
};
