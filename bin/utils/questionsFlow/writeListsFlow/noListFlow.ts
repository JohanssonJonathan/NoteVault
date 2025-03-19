import confirmQuestion from '../../questions/confirmQuestion.ts';
import inputQuestion from '../../questions/inputQuestion.ts';
import { getPreviousAnswers, updatePreviousAnswers } from '../../../index.ts';
import { createListHandler } from '../../handlers/createHandler.ts';
import writeItemsFlow from '../writeItemsFlow.ts';

const noListFlow = async () => {
  const { rowName } = getPreviousAnswers();
  return confirmQuestion(
    `There are no lists inside ${rowName.value}. Do you want to create a new one?`
  ).then(async (answer) => {
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

export default noListFlow;
