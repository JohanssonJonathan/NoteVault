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

const questions = [() => 'Write your note'];

const editorQuestion = async ({ question, validate }: IConfirmQuestion) => {
  const selectedQuestion = questions[question];

  return inquirer
    .prompt([
      {
        type: 'editor',
        name: 'editor',
        message: selectedQuestion(),
        validate: (value) => {
          if (validate) {
            return Boolean(value.length);
          }

          return true;
        },
      },
    ])
    .then((answers) => {
      return answers.editor;
    });
};

export default editorQuestion;
