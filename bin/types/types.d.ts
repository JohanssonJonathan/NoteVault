import { value } from '../utils/consts.ts';

export type TTables = typeof value.list | typeof value.note;

interface IBaseData {
  tableName: TTables;
  rowName: { id: string; value: string };
}

interface IListItem {
  id: string;
  created: Date;
  modified?: Date;
  items: {
    id: string;
    name: string;
  }[];
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

interface IListRow extends IRow {
  lists: IListItem[];
}

interface INoteRow extends IRow {
  notes: INoteItem[];
}
