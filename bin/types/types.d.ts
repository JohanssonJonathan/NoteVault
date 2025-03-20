import { value, dbTables } from '../utils/consts.ts';

export type TTables =
  | typeof dbTables.listCollection
  | typeof dbTables.noteCollection;

interface IBaseData {
  tableName: TTables;
  rowName: { id: string; value: string };
}

interface IListItem {
  id: number;
  name: string;
  created: number;
  modified?: number;
  link?: string;
  isDone?: number;
}

interface IList {
  id: number;
  name: string;
  created: Date;
  modified?: Date;
  items: null | string;
}

interface INoteItem {
  id: string;
  created: Date;
  modified?: Date;
  title: string;
  note: string;
}

interface IRow {
  id: string;
  name: string;
  created: Date;
}

interface ICollectionRow {
  id: number;
  created: number;
  name: string;
  lists: null | string;
}

interface IListRow extends IRow {
  lists: IList[];
}

interface INoteRow extends IRow {
  notes: INoteItem[];
}
