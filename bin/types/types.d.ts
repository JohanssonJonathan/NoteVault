import { value } from '../utils/consts.ts';

export type TTables = typeof value.list | typeof value.note;

interface IBaseData {
  tableName: TTables;
  rowName: { id: string; value: string };
}

export interface IData<T> {
  data: T;
  name?: string;
}
interface General {
  created: Date;
}

interface ITodoList extends General {
  items: string[];
}

interface INotesList extends General {
  title: string;
  note: string;
}

export interface ITodoRow extends General {
  lists: ITodoList[];
  name: string;
}

export interface INotesRow extends General {
  notes: INotesList[];
  name: string;
}

type TSelectionAnswer = {
  selection: string;
  new?: never;
  id?: never;
  name?: string;
};

type TIdAnswer = {
  id: string;
  selection?: never;
  new?: never;
  value?: never;
  name?: string;
};

type TNewAnswer = {
  new: boolean;
  selection?: never;
  id?: never;
  value?: never;
  name?: string;
};

export type IAnswerSelection = TSelectionAnswer | TIdAnswer | TNewAnswer;
