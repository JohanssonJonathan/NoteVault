#!/usr/bin/env node

import { inititalQuestion } from './utils/questions/initialQuestion.ts';
import type { TInitialQuestionSelection } from './utils/questions/initialQuestion.ts';
import getCurrentTableHandler from './utils/handlers/getCurrentTableHandler.ts';
import type { TTables } from './types/types.d.ts';
import chalk from 'chalk';
import emptyTableFlow from './utils/questionsFlow/emptyTableFlow.ts';
import { actions } from './utils/consts.ts';
const { USER } = process.env;

const user = USER
  ? USER.charAt(0).toUpperCase() + USER.substring(1, USER.length)
  : undefined;

let tableName: TTables;
let action:
  | typeof actions.read
  | typeof actions.deleteRow
  | typeof actions.deleteItem
  | typeof actions.write;
// updates on the flow depending on what the user answer
// First question when just running the cli without any arguments
inititalQuestion(user)
  // Handle the answer and find the specific table. At the moment there are two tables.
  // List and Notes
  .then((answer: TInitialQuestionSelection) => {
    tableName = answer.value;
    action = answer.action;

    return getCurrentTableHandler(tableName);
  })
  .then((data) => {
    const isDelete = action.match(/delete/);
    if (data.length === 0) {
      if (isDelete) {
        console.log(
          chalk.red(`You don't have anything to delete in ${tableName}.`)
        );
        return;
      }

      return emptyTableFlow(tableName);
    }

    console.log('HEJsan');
  });

// emptyTableFlow('note');
