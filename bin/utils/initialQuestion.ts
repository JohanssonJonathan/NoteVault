import inquirer from 'inquirer';
import type { TSelectionAnswer } from '../types.d.ts';

export const inititalQuestion = async (
  user?: string
): Promise<TSelectionAnswer> => {
  const choices: { value: TSelectionAnswer; name: string }[] = [
    {
      name: 'I want to write a list',
      value: { selection: 'list' },
    },
    {
      name: 'I just feel like writing a note',
      value: { selection: 'write' },
    },
  ];
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'selections',
        message: `Hello${user ? ` ${user}` : ''}. What's on your mind?`,
        choices,
      },
    ])
    .then((answers) => {
      return answers.selections;
    });
};
