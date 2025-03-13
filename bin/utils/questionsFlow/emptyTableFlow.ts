import confirmQuestion from '../questions/confirmQuestion.ts';
import { getPreviousAnswers } from '../../index.ts';
import createNewCollectionFlow from './createNewCollectionFlow.ts';

const emptyTableFlow = async () => {
  const { tableName } = getPreviousAnswers();
  return confirmQuestion({
    message: `You haven't created any ${tableName}'s yet. Do you want to create your first ${tableName}'s collection?`,
  })
    .then((answer) => {
      if (!answer) {
        // quit program !!!
        process.exit();
      }

      return true;
    })
    .then(() => createNewCollectionFlow());
};

export default emptyTableFlow;
