import inquirer from 'inquirer';
import { value } from '../consts.ts';

type TTableName = typeof value.list | typeof value.note;
interface IConfirmQuestion {
  tableName: TTableName;
  question: number;
  validate?: boolean;
  rowName?: { id?: string; value: string };
  items?: string[];
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
  tableName,
  rowName,
  items = [],
  question,
  validate,
}: IConfirmQuestion): ReturnType<typeof inputQuestion> => {
  return inputQuestion({
    tableName,
    rowName,
    items,
    question,
    validate,
  }).then((answer) => {
    if (answer.length === 0) {
      return answer;
    }

    return inputQuestionLoop({
      tableName,
      rowName,
      question,
      items: [answer, ...items],
    });
  });
};

const inputQuestion = async ({
  tableName,
  rowName,
  question,
  validate,
}: IConfirmQuestion) => {
  const selectedQuestion = questions[question];

  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'input',
        message: selectedQuestion(tableName, rowName?.value),
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
