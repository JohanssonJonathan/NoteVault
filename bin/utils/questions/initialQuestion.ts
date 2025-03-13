import inquirer from 'inquirer';
import { actions, value } from '../consts.ts';

export type TInitialQuestionSelection = {
  value: typeof value.list | typeof value.note;
  action: typeof actions.read | typeof actions.delete | typeof actions.write;
};

const firstListChoices = [
  {
    name: 'I want to write a list',
    value: { value: value.list, action: actions.write },
  },
  {
    name: 'Show me my list',
    value: { value: value.list, action: actions.read },
  },
];

const firstNoteChoices = [
  {
    name: 'I want to write a note',
    value: { value: value.note, action: actions.write },
  },
  {
    name: 'Show me my notes',
    value: { value: value.note, action: actions.read },
  },
];
const firstChoices = [
  {
    name: 'I want to write a note or a list',
    value: { value: null, action: actions.write },
  },
  {
    name: 'Show me my notes/list',
    value: { value: null, action: actions.read },
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

export const inititalQuestion = async (
  argv: {
    write?: boolean;
    read?: boolean;
    delete?: boolean;
    list?: boolean;
    note?: boolean;
  },
  user?: string
) => {
  const preSelectedRead = argv['read'];
  const preSelectedWrite = argv['write'];
  const preSelectedDelete = argv['delete'];
  const preSelectedList = argv['list'];
  const preSelectedNote = argv['note'];

  if (preSelectedList || preSelectedNote) {
    if (preSelectedRead || preSelectedWrite) {
      return {
        value: preSelectedList ? value.list : value.note,
        action: preSelectedRead ? actions.read : actions.write,
      };
    }
  }

  if (preSelectedRead || preSelectedWrite) {
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'selections',
          message: `What do you want to ${preSelectedWrite ? 'write' : 'read'}?`,
          choices: [
            ...(preSelectedWrite ? writeChoices : readChoices),
            new inquirer.Separator(),
            {
              name: 'Quit',
              value: { value: 'quit', action: 'quit' },
            },
          ],
          loop: false,
        },
      ])
      .then((answer) => {
        if (answer.selections.value === 'quit') {
          return process.exit();
        }
        return answer.selections;
      });
  }

  if (preSelectedList || preSelectedNote) {
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'selections',
          message: `Write or read from your ${preSelectedList ? value.list : value.note}'s`,
          choices: [
            ...(preSelectedList ? firstListChoices : firstNoteChoices),
            new inquirer.Separator(),
            {
              name: 'Quit',
              value: { value: 'quit', action: 'quit' },
            },
          ],
          loop: false,
        },
      ])
      .then((answer) => {
        if (answer.selections.value === 'quit') {
          return process.exit();
        }
        return answer.selections;
      });
  }

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
            name: 'Quit',
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
          choices: [
            ...choices.choices,

            new inquirer.Separator(),
            {
              name: 'Quit',
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
