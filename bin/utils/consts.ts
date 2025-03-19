import { getPreviousAnswers } from '../index.ts';
export const value = {
  list: 'listCollection',
  note: 'note',
} as const;

export const dbTables = {
  noteCollection: 'noteCollection',
  listCollection: 'listCollection',
  lists: 'lists',
  listItems: 'listItems',
};

export const actions = {
  write: 'write',
  delete: 'delete',
  read: 'read',
} as const;

export const arg = {
  area: 'area',
  collection: 'collection',
  note: 'note',
  list: 'list',
  listItem: 'listItem',
  action: 'action',
} as const;

export const message = [false, 'exist', 'dontexist'];
export const questions = () => {
  const { tableName, rowName } = getPreviousAnswers();

  return [
    'Choose between the options',
    'Which collection would you like to read from',
    'What should the collection be called?',
    `Create a title for the ${tableName} inside ${rowName} collection`,
    'Write your note',
    'Write your first item',
    'Write your next item (just press enter without any text to preview the list)',
    'Write a title for your new note',
    'Change as you wish. If you want to remove, keep it blank and press enter',
  ];
};
