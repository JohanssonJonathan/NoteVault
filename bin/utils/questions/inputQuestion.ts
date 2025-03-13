import inquirer from 'inquirer';
import { value } from '../consts.ts';

type TTableName = typeof value.list | typeof value.note;
interface IConfirmQuestion {
  message: string;
  validate?: boolean;
  items?: string[];
  value?: string;
}

const questions = [
  () => 'What should the collection be called?',
  (tableName: TTableName, rowName?: string) =>
    `Create a title for the ${tableName} inside ${rowName} collection`,
  () => 'Write your note',
  () => 'Write your first item',
  () =>
    'Write your next item (just press enter without any text to preview the list)',
  () => 'Write a title for your new note',
];

export const inputQuestionLoop = async ({
  items = [],
  message,
  validate,
}: IConfirmQuestion): ReturnType<typeof inputQuestion> => {
  return inputQuestion({
    items,
    message,
    validate,
  }).then((answer) => {
    if (answer.length === 0) {
      return answer;
    }

    return inputQuestionLoop({
      message,
      items: [answer, ...items],
    });
  });
};

const inputQuestion = async ({
  message,
  validate,
  value,
}: IConfirmQuestion) => {
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'input',
        default: value || '',
        message,
        validate: (value) => {
          if (validate) {
            return Boolean(value.length);
          }

          return true;
        },
      },
    ])
    .then((answers) => {
      return answers.input;
    });
};

export default inputQuestion;
