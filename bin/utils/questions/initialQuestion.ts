import inquirer from 'inquirer';
import { actions, value } from '../consts.ts';

export type TInitialQuestionSelection = {
  value: typeof value.list | typeof value.note;
  action:
    | typeof actions.read
    | typeof actions.deleteRow
    | typeof actions.deleteItem
    | typeof actions.write;
};

const firstChoices = [
  {
    name: 'I want to write a note or a list',
    value: { value: null, action: actions.write },
  },
  {
    name: 'Show me my notes/list',
    value: { value: null, action: actions.read },
  },
  {
    name: 'I want to delete either a collection or a specific note/list',
    value: { value: null, action: actions.deleteRow },
  },
];

const deleteChoices = [
  {
    name: 'I want to delete a note collection',
    value: { value: value.note, action: actions.deleteRow },
  },
  {
    name: 'I want to delete a list collection',
    value: { value: value.list, action: actions.deleteRow },
  },
  {
    name: 'I want to delete a specific list',
    value: { value: value.list, action: actions.deleteItem },
  },
  {
    name: 'I want to delete a specific note',
    value: { value: value.note, action: actions.deleteItem },
  },
];

const writeChoices = [
  {
    name: 'I want to write a list',
    value: { value: value.list, action: actions.write },
  },
  {
    name: 'I just feel like writing a note',
    value: { value: value.note, action: actions.write },
  },
];

const readChoices = [
  {
    name: 'I want to see my lists',
    value: { value: value.list, action: actions.read },
  },
  {
    name: 'I want to see my notes',
    value: { value: value.note, action: actions.read },
  },
];

export const inititalQuestion = async (user?: string) => {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'selections',
        message: `Hello${user ? ` ${user}` : ''}. What's on your mind?`,
        choices: firstChoices,
        loop: false,
      },
    ])
    .then((answers) => {
      if (answers.selections.action === actions.deleteRow) {
        return { type: 'delete', choices: deleteChoices };
      }

      if (answers.selections.action === actions.write) {
        return { type: 'write', choices: writeChoices };
      }

      return { type: 'read', choices: readChoices };
    })
    .then((choices) =>
      inquirer.prompt([
        {
          type: 'list',
          name: 'selections',
          message: `What do you want to ${choices.type}?`,
          choices: choices.choices,
          loop: false,
        },
      ])
    )
    .then((answers) => answers.selections);
};
