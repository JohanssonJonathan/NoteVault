import { getPreviousAnswers, updatePreviousAnswers } from '../../index.ts';
import { createCollectionHandler } from '../handlers/createHandler.ts';
import inputQuestion from '../questions/inputQuestion.ts';
import writeItemsFlow from './writeItemsFlow.ts';

const createNewCollectionFlow = async () => {
  const { tableName } = getPreviousAnswers();
  return inputQuestion({
    message: 'What should the collection be called?',
    validate: true,
  })
    .then((answer) => {
      updatePreviousAnswers({ rowName: { value: answer } });
      return createCollectionHandler(tableName, answer);
    })
    .then((data) => {
      if (!data) {
        console.log('Where not able to create new collection');
        process.exit();
      }

      updatePreviousAnswers({ rowName: { value: data.name, id: data.id } });
      return true;
    })
    .then(() => writeItemsFlow());
};

export default createNewCollectionFlow;
