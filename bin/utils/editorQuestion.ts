import inquirer from 'inquirer';
import { value } from './consts.ts';

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
];

const editorQuestion = async ({
  tableName,
  rowName,
  items = [],
  question,
  validate,
}: IConfirmQuestion) => {
  const selectedQuestion = questions[question];

  return inquirer
    .prompt([
      {
        type: 'editor',
        name: 'editor',
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
      return { answer: answers.editor, data: { tableName, rowName, items } };
    });
};

export default editorQuestion;
