#!/usr/bin/env node

import { inititalQuestion } from './utils/initialQuestion.ts';
import { answerHandler } from './utils/answerHandler.ts';
import { finalAnswerHandler } from './utils/finalAnswerHandler.ts';
import { questionSelectRow } from './utils/questionSelectRow.ts';
import type { TSelectionAnswer, IAnswerSelection } from './types.d.ts';

const { USER } = process.env;

const user = USER
  ? USER.charAt(0).toUpperCase() + USER.substring(1, USER.length)
  : undefined;

// First question when just running the cli without any arguments
inititalQuestion(user)
  // Handle the answer and find the specific table. At the moment there are two tables.
  // List and Notes
  .then((answer: TSelectionAnswer) => finalAnswerHandler(answer))
  // Return the current table and select the specific row you want to pick.
  .then((table) => questionSelectRow(table))
  .then((answer: IAnswerSelection) => {
    if (answer.new) {
      // questionnameofthe new rot
    }

    if (answer.id) {
      // question write to the existing row that the user selected
    }
  });
