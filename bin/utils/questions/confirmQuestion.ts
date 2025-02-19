import inquirer from 'inquirer';
import { value } from '../consts.ts';

type TTableName = typeof value.list | typeof value.note;
interface IConfirmQuestion {
  tableName: TTableName;
  question: number;
  rowName?: { id?: string; value: string };
  items?: string[];
}

const questions = [
  (tableName: TTableName) =>
    `You haven't created any ${tableName}'s yet. Do you want to create your first ${tableName}'s collection?`,
  (tableName: TTableName, rowName?: string) =>
    `Created successfully! Do you want to add your first ${tableName} in your newly created ${rowName} collection?`,
  (tableName: TTableName, rowName?: string) =>
    `Do you want to create your newly created ${tableName} inside ${rowName}? `,
  (tableName: TTableName, rowName?: string, title?: string) =>
    `Are you sure you want to delete ${title} in ${rowName}, inside ${tableName}?`,
  (tableName: TTableName, rowName?: string) =>
    `Are you sure you want to delete ${rowName} in ${tableName}?`,
  () => `Confirm if you want to create. Deny if you want to add more.`,
  () => `Yes I am done, add it! No if you want to continue adding.`,
];

const confirmQuestion = async ({
  tableName,
  rowName,
  question,
}: IConfirmQuestion) => {
  const selectedQuestion = questions[question];

  return inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: selectedQuestion(tableName, rowName?.value),
      },
    ])
    .then((answers) => {
      return answers.confirm;
    });
};

export default confirmQuestion;
