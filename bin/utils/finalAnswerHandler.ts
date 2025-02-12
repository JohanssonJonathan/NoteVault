import type { TSelectionAnswer } from '../types.d.ts';
import { getTodoTables, getNotesTables } from './getData.ts';

// A final answer handler is an answer we can use to make CRUD operations on.
export const finalAnswerHandler = async (answer: TSelectionAnswer) => {
  try {
    const selectedTable =
      answer.selection === 'list'
        ? await getTodoTables()
        : await getNotesTables();

    return { data: selectedTable, name: answer.name };
  } catch (err) {
    return { data: [], name: answer.name };
  }
};
