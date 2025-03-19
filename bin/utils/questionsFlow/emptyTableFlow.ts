import confirmQuestion from '../questions/confirmQuestion.ts';
import { getPreviousAnswers } from '../../index.ts';
import inputQuestion from '../questions/inputQuestion.ts';
import {
  createCollectionHandler,
  createListHandler,
} from '../handlers/createHandler.ts';
import { dbTables } from '../consts.ts';
import type { ICollectionRow, IListRow, IList } from '../../types/types.js';
import { updatePreviousAnswers } from '../../index.ts';
import writeItemsFlow from './writeItemsFlow.ts';

const emptyTableFlow = async () => {
  const { tableName } = getPreviousAnswers();

  return confirmQuestion(
    `You haven't created any ${tableName}'s yet. Do you want to create your first ${tableName}'s collection?`
  )
    .then((answer) => {
      if (!answer) {
        process.exit();
      }

      return true;
    })
    .then(() =>
      inputQuestion({
        message: 'Write a name for your collection',
        validate: true,
      })
    )
    .then((answer) => createCollectionHandler(dbTables.listCollection, answer))
    .then((data: ICollectionRow) => {
      updatePreviousAnswers({ rowName: { id: data.id, value: data.name } });

      return confirmQuestion(
        `Do you want to create your first list inside ${data.name} collection`
      );
    })
    .then(async (answer) => {
      const { rowName } = getPreviousAnswers();

      if (answer) {
        return inputQuestion({
          message: 'Write a name for your list',
          validate: true,
        })
          .then((answer) => createListHandler(rowName.id as number, answer))
          .then((result) => {
            updatePreviousAnswers({ list: result.list });

            return confirmQuestion(
              'Do you want your list to have the possibility to toggle on or off functionallity?'
            );
          })
          .then((answer) => {
            return writeItemsFlow({ toggle: answer });
          });
      }

      process.exit();
    });
};

export default emptyTableFlow;
