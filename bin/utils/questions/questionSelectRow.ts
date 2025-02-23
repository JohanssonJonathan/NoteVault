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

const questions = [
  'Choose between the options',
  'Which collection would you like to read from',
];

interface IQuestionSelectRow {
  question: number;
  choices: { name: string; value: { id: string; value: string } }[];
}

const questionSelectRow = async ({ choices, question }: IQuestionSelectRow) => {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'selections',
        message: questions[question],
        choices,
        loop: false,
      },
    ])
    .then((answers) => answers.selections);
};

export default questionSelectRow;
