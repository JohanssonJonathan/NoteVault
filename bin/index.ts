#!/usr/bin/env node

import { inititalQuestion } from './utils/questions/initialQuestion.ts';
import type { TInitialQuestionSelection } from './utils/questions/initialQuestion.ts';
import getCurrentTableHandler from './utils/handlers/getCurrentTableHandler.ts';
import type {
  IListRow,
  INoteRow,
  TTables,
  IListItem,
} from './types/types.d.ts';
import chalk from 'chalk';
import emptyTableFlow from './utils/questionsFlow/emptyTableFlow.ts';
import { actions } from './utils/consts.ts';
import questionSelectRow from './utils/questions/questionSelectRow.ts';
import { deleteCollectionFlow } from './utils/questionsFlow/deleteCollectionFlow.ts';
import { value } from './utils/consts.ts';
import { deleteHandlerItems } from './utils/handlers/deleteHandler.ts';
import showCollectionFlow from './utils/questionsFlow/showCollectionFlow.ts';
import showListsFlow from './utils/questionsFlow/showListsFlow.ts';
import { deleteItemsFlow } from './utils/questionsFlow/deleteItemsFlow.ts';
const { USER } = process.env;

const user = USER
  ? USER.charAt(0).toUpperCase() + USER.substring(1, USER.length)
  : undefined;

let tableName: TTables;
let rowName: { id?: string; value?: string } = {};
let list: IListItem;
let action: typeof actions.read | typeof actions.delete | typeof actions.write;

export const getPreviousAnswers = () => {
  return {
    tableName,
    rowName,
    list,
  };
};

export const updatePreviousAnswers = ({
  tableName: newTableName,
  rowName: newRowName,
  list: newList,
}: {
  tableName?: TTables;
  rowName?: { id?: string; value?: string };
  list?: IListItem;
}) => {
  tableName = newTableName || tableName;
  rowName = newRowName || rowName;
  list = newList || list;
};

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

    const testChoices = [
      {
        name: 'Show specific item',
        value: { id: actions.read, value: actions.read },
      },
      {
        name: 'Delete it',
        value: { id: actions.delete, value: actions.delete },
      },
    ];

    return showCollectionFlow(tableName, data)
      .then(() => questionSelectRow({ choices: testChoices, question: 0 }))
      .then((answer) => {
        if (answer.value === actions.delete) {
          return deleteCollectionFlow({
            tableName,
            rowName: rowName as { id: string; value: string },
          }).then(() => process.exit());
        }
        return;
      })
      .then(() => {
        if (tableName === value.list) {
          return showListsFlow({ data })
            .then(() => {
              const choices = [
                {
                  name: 'Modify items',
                  value: { id: actions.write, value: actions.write },
                },
                {
                  name: 'Delete it',
                  value: { id: actions.delete, value: actions.delete },
                },
              ];
              return questionSelectRow({ choices, question: 0 });
            })
            .then((answer) => {
              if (answer.id === actions.delete) {
                return deleteItemsFlow().then(() => process.exit);
              }
            });
        }

        // const noteRow = currentRow as INoteRow;
        // return questionSelectRow({
        //   choices: noteRow.notes.map(({ id, title }) => ({
        //     name: title,
        //     value: { id, value: title },
        //   })),
        //   question: 0,
        // });
      })
      .then((answer) => {
        console.log('answer: ', answer);
      });
  });

// emptyTableFlow('note');
