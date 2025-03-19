import { dbTables } from '../consts.ts';
import type { ICollectionRow } from '../../types/types.d.ts';
import confirmQuestion from '../questions/confirmQuestion.ts';
import inputQuestion from '../questions/inputQuestion.ts';
import { getPreviousAnswers, updatePreviousAnswers } from '../../index.ts';
import {
  createListHandler,
  createCollectionHandler,
} from '../handlers/createHandler.ts';
import writeItemsFlow from './writeItemsFlow.ts';

const createNewCollectionFlow = async () => {
  // Create a new collection
  return inputQuestion({
    message: 'Write a name for your collection',
    validate: true,
  })
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
export default createNewCollectionFlow;
