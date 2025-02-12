import { todoTables } from '../dummyData/todoTables.ts';
import { notesTables } from '../dummyData/notesTables.ts';
import type { IData, ITodoRow, INotesRow } from '../types.d.ts';

// get the todo tables from the db
export const getTodoTables = (): Promise<ITodoRow[]> => {
  return new Promise((resolve) => resolve(todoTables));
};

export const getNotesTables = (): Promise<INotesRow[]> => {
  return new Promise((resolve) => resolve(notesTables));
};
