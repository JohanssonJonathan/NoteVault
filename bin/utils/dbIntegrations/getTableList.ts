import { todoTables } from '../../dummyData/todoTables.ts';
import type { ITodoRow } from '../../types.d.ts';

const getTableList = (): Promise<ITodoRow[]> => {
  return new Promise((resolve) => resolve(todoTables));
};

export default getTableList;
