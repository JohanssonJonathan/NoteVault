import inquirer from 'inquirer';
import { actions, value } from '../consts.ts';
import chalk from 'chalk';
export type TInitialQuestionSelection = {
  value: typeof value.list | typeof value.note;
  action: typeof actions.read | typeof actions.write;
};

const questionSelectRow = async (
  message: string,
  choices: any,
  firstChoices: any = []
) => {
  const currentChoices = [
    ...firstChoices,
    firstChoices.length ? new inquirer.Separator() : undefined,
    ...choices,
    new inquirer.Separator(),
    {
      name: chalk.red.dim.italic('Quit'),
      value: { value: 'quit', action: 'quit' },
    },
  ].filter((value) => value);

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'selections',
        message,
        choices: currentChoices,
        loop: false,
      },
    ])
    .then((answers) => {
      if (answers.selections.action === 'quit') {
        return process.exit();
      }
      return answers.selections;
    });
};
export default questionSelectRow;
