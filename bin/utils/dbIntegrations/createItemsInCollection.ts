import { notesTables } from '../../dummyData/notesTables.ts';
import type { INotesTables } from '../../dummyData/notesTables.ts';
import { todoTables } from '../../dummyData/todoTables.ts';
import type { ITodoTables } from '../../dummyData/todoTables.ts';
import { v4 as uuidv4 } from 'uuid';

export const createCollectionInList = (name: string): Promise<ITodoTables> => {
  return new Promise((resolve) => {
    const newItem = {
      id: uuidv4(),
      name: name,
      created: new Date(),
      lists: [],
    };
    todoTables.push(newItem);

    resolve(newItem);
  });
};

export const createCollectionInNotes = (
  name: string
): Promise<INotesTables> => {
  return new Promise((resolve) => {
    const newItem = {
      id: uuidv4(),
      name: name,
      created: new Date(),
      notes: [],
    };
    notesTables.push(newItem);

    resolve(newItem);
  });
};
