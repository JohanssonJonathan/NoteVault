import inquirer from 'inquirer';
import { value } from '../consts.ts';

type TTableName = typeof value.list | typeof value.note;
interface IConfirmQuestion {
  message: string;
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
  () => `Do you want to edit the content of your list?`,
  () => `Are you sure you want to delete?`,
];

const confirmQuestion = async ({ message }: IConfirmQuestion) =>
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message,
      },
    ])
    .then((answers) => {
      return answers.confirm;
    });

export default confirmQuestion;
