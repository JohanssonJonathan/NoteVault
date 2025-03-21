import inquirer from 'inquirer';
import { actions, dbTables, value } from '../consts.ts';
import chalk from 'chalk';
import { getPreviousArguments } from '../../index.ts';

export type TInitialQuestionSelection = {
  value: typeof value.list | typeof value.note;
  action: typeof actions.read | typeof actions.delete | typeof actions.write;
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
    name: 'Delete a note/list',
    value: { value: null, action: actions.delete },
  },
];

const writeChoices = [
  {
    name: 'I want to write a list',
    value: { value: dbTables.listCollection, action: actions.write },
  },
  {
    name: 'I just feel like writing a note',
    value: { value: dbTables.noteCollection, action: actions.write },
  },
];

const readChoices = [
  {
    name: 'I want to see my lists',
    value: { value: dbTables.listCollection, action: actions.read },
  },
  {
    name: 'I want to see my notes',
    value: { value: dbTables.noteCollection, action: actions.read },
  },
];

const deleteChoices = [
  {
    name: 'Delete a list',
    value: { value: dbTables.listCollection, action: actions.delete },
  },
  {
    name: 'Delete a note',
    value: { value: dbTables.noteCollection, action: actions.delete },
  },
];

const selectedListChoices = [
  {
    name: 'Write a list',
    value: { value: dbTables.listCollection, action: actions.write },
  },
  {
    name: 'Look at your lists',
    value: { value: dbTables.listCollection, action: actions.read },
  },
  {
    name: 'I want to delete something from my list',
    value: { value: dbTables.listCollection, action: actions.delete },
  },
];

export const inititalQuestion = async (user?: string) => {
  const {
    area: selectedArea,
    action: selectedAction,
    collection: selectedCollection,
  } = getPreviousArguments();

  // Area is selected
  if (selectedArea === 'list' || selectedArea === 'note') {
    if (!selectedAction) {
      return inquirer
        .prompt([
          {
            type: 'list',
            name: 'selections',
            message: selectedCollection
              ? `What do you want to do in collection '${selectedCollection}' inside ${selectedArea} area?`
              : 'You are in your list area',
            choices: [
              ...selectedListChoices,
              new inquirer.Separator(),
              {
                name: chalk.red.dim.italic('Quit'),
                value: { value: 'quit', action: 'quit' },
              },
            ],
            loop: false,
          },
        ])
        .then((answers) => {
          if (answers.selections.value === 'quit') {
            return process.exit();
          }
          return answers.selections;
        });
    }

    if (selectedAction === actions.read) {
      return { value: dbTables.listCollection, action: actions.read };
    }
    if (selectedAction === actions.write) {
      return { value: dbTables.listCollection, action: actions.write };
    }

    if (selectedAction === actions.delete) {
      return { value: dbTables.listCollection, action: actions.delete };
    }
  }

  // Action is selected but Area is not
  if (
    selectedAction === actions.read ||
    selectedAction === actions.write ||
    selectedAction === actions.delete
  ) {
    const isWrite = selectedAction === actions.write;
    const isDelete = selectedAction === actions.delete;

    let listMessage = 'I want to see my lists';
    let noteMessage = 'I want to see my notes';

    if (isWrite) {
      listMessage = 'I want to write a list';
      noteMessage = 'I want to write a note';
    } else if (isDelete) {
      listMessage = 'I want to delete inside list';
      noteMessage = 'I want to delete inside note';
    }

    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'selections',
          message: `In what area do you want to ${selectedAction}?`,
          choices: [
            {
              name: listMessage,
              value: { value: dbTables.listCollection, action: selectedAction },
            },
            {
              name: noteMessage,
              value: { value: dbTables.noteCollection, action: selectedAction },
            },
            new inquirer.Separator(),
            {
              name: chalk.red.dim.italic('Quit'),
              value: { value: 'quit', action: 'quit' },
            },
          ],
          loop: false,
        },
      ])
      .then((answers) => {
        if (answers.selections.value === 'quit') {
          return process.exit();
        }
        return answers.selections;
      });
  }

  // nothing is selected
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'selections',
        message: `Hello${user ? ` ${user}` : ''}. What's on your mind?`,
        choices: [
          ...firstChoices,
          new inquirer.Separator(),
          {
            name: chalk.red.dim.italic('Quit'),
            value: { value: 'quit', action: 'quit' },
          },
        ],
        loop: false,
      },
    ])
    .then((answers) => {
      if (answers.selections.action === 'quit') {
        return process.exit();
      }
      if (answers.selections.action === actions.write) {
        return { type: actions.write, choices: writeChoices };
      }

      if (answers.selections.action === actions.delete) {
        return { type: actions.delete, choices: deleteChoices };
      }
      return { type: actions.read, choices: readChoices };
    })
    .then((choices) =>
      inquirer.prompt([
        {
          type: 'list',
          name: 'selections',
          message: `What do you want to ${choices.type}?`,
          choices: [
            ...choices.choices,
            new inquirer.Separator(),
            {
              name: chalk.red.dim.italic('Quit'),
              value: { value: 'quit', action: 'quit' },
            },
          ],
          loop: false,
        },
      ])
    )
    .then((answers) => {
      if (answers.selections.value === 'quit') {
        return process.exit();
      }
      return answers.selections;
    });
};
