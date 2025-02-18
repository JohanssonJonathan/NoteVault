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

      // Only create because no exist
      return confirmQuestion({ tableName: answer.value, question: 0 })
        .then(({ data, answer }) => {
          if (!answer) {
            // quit program !!!
            process.exit();
          }

          return data;
        })
        .then((data) =>
          inputQuestion({
            tableName: data.tableName,
            question: 0,
            validate: true,
          })
        )
        .then(({ answer, data }) =>
          createHandler({ tableName: data.tableName, name: answer })
        )
        .then((data) => {
          if (data) {
            const { data: currentData, created } = data;

            return confirmQuestion({
              tableName: currentData.tableName,
              rowName: { value: created.name, id: created.id },
              question: 1,
            });
          }

          console.log('Where not able to create new collection');
          process.exit();
        })
        .then((answer) => {
          if (!answer.answer) {
            // quit program !!!
            process.exit();
          }

          return answer;
        })
        .then(({ answer, data }) => {
          // write your first item todo
          if (data.tableName === value.list) {
            return inputQuestion({
              tableName: data.tableName,
              rowName: data.rowName,
              question: 3,
              validate: true,
            });
          }

          return editorQuestion({
            tableName: data.tableName,
            rowName: data.rowName,
            question: 3,
            validate: true,
          });
          // write your note in an editor
        })
        .then(({ answer, data }) => {
          if (data.tableName === value.list) {
            console.log('Collection name: ', data.rowName);
            const currentItems = [answer, ...data.items];
            currentItems.map((item) => console.log(`* ${item}`));

            return inputQuestionLoop({
              tableName: data.tableName,
              rowName: data.rowName,
              items: [answer, ...data.items],
              question: 4,
            });
          }
        })
        .then(({ answer, data }) => {
          if (data.tableName === value.list) {
            return;
          }
        })
        .then(({ answer, data }) => {
          console.log('data: ', data);

          console.log('answer: ', answer);
        });
      // .then((answer)=> inputQuestion({tableName: }));
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
