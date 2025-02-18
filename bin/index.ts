#!/usr/bin/env node

import { inititalQuestion } from './utils/initialQuestion.ts';
import type { TInitialQuestionSelection } from './utils/initialQuestion.ts';
import getCurrentTableHandler from './utils/handlers/getCurrentTableHandler.ts';
import confirmQuestion from './utils/confirmQuestion.ts';
import type { TTables } from './types.d.ts';
import inputQuestion, { inputQuestionLoop } from './utils/inputQuestion.ts';
import chalk from 'chalk';
import createHandler from './utils/handlers/createHandler.ts';
import { value } from './utils/consts.ts';
import editorQuestion from './utils/editorQuestion.ts';
import emptyTableFlow from './emptyTableFlow.ts';

const { USER } = process.env;

const user = USER
  ? USER.charAt(0).toUpperCase() + USER.substring(1, USER.length)
  : undefined;

interface ICurrentData {
  tableName?: TTables;
  row?: {
    name: string;
    id: string;
  };
}
// updates on the flow depending on what the user answer
const currentData: ICurrentData = {};
// First question when just running the cli without any arguments
inititalQuestion(user)
  // Handle the answer and find the specific table. At the moment there are two tables.
  // List and Notes
  .then((answer: TInitialQuestionSelection) => {
    currentData.tableName = answer.value;

    return getCurrentTableHandler(answer);
  })
  .then(({ data, answer }) => {
    const isDelete = answer.action.match(/delete/);
    if (data.length === 0) {
      if (isDelete) {
        console.log(
          chalk.red(`You don't have anything to delete in ${answer.value}.`)
        );
        return;
      }

      return emptyTableFlow(answer.value);
    }

    console.log('HEJsan');
  });
// // Return the current table and select the specific row you want to pick.
// .then((table) => questionSelectRow(table))
// .then((answer: IAnswerSelection) => {
//   if (answer.new) {
//     // questionnameofthe new rot
//   }
//
//   if (answer.id) {
//     // question write to the existing row that the user selected
//   }
// });
