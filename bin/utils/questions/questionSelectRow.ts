import inquirer from 'inquirer';
import { actions, value } from '../consts.ts';

export type TInitialQuestionSelection = {
  value: typeof value.list | typeof value.note;
  action: typeof actions.read | typeof actions.write;
};

const questionSelectRow = async (message: string, choices: any) =>
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'selections',
        message,
        choices,
        suffix: 'Suffix',
        prefix: 'Prefix',
        loop: false,
      },
    ])
    .then((answers) => answers.selections);

export default questionSelectRow;
