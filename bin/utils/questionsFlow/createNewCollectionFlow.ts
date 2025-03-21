import { actions, dbTables } from '../consts.ts';
import type { ICollectionRow } from '../../types/types.d.ts';
import confirmQuestion from '../questions/confirmQuestion.ts';
import inputQuestion from '../questions/inputQuestion.ts';
import { getPreviousAnswers, updatePreviousAnswers } from '../../index.ts';
import {
  createListHandler,
  createCollectionHandler,
} from '../handlers/createHandler.ts';
import writeItemsFlow from './writeItemsFlow.ts';
import { clearAnswers, startQuestions, updateArguments } from '../../index.ts';

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
    .then(async (confirm) => {
      const { rowName } = getPreviousAnswers();

      if (confirm) {
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
          })
          .then(() => {
            const { list } = getPreviousAnswers();
            updateArguments({
              area: 'list',
              collection: rowName.value,
              list: list?.name,
              action: actions.write,
            });
            startQuestions();
          });
      }

      clearAnswers({ rowName: true });
      updateArguments({
        area: 'list',
        action: actions.write,
      });
      startQuestions();
    });
};
export default createNewCollectionFlow;
