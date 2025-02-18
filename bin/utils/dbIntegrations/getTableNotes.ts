import { notesTables } from '../../dummyData/notesTables.ts';
import type { INotesRow } from '../../types.d.ts';

const getTableNotes = (): Promise<INotesRow[]> => {
  return new Promise((resolve) => resolve(notesTables));
};

export default getTableNotes;
