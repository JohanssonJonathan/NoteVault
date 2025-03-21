import {
  clearAnswers,
  updateArguments,
  startQuestions,
  getPreviousAnswers,
} from '../../index.ts';
import questionSelectRow from '../questions/questionSelectRow.ts';
import { deleteListCollectionHandler } from '../handlers/deleteHandler.ts';
import { getCollectionsHandler } from '../handlers/getHandler.ts';
import { dbTables, actions } from '../consts.ts';
import confirmQuestion from '../questions/confirmQuestion.ts';

const deleteCollectionFlow = async (answer) => {
  const { rowName, lists } = getPreviousAnswers();

  // There are no lists inside the collection. Only ask if user wants delete.
  if (lists?.length === 0) {
    return confirmQuestion(`Delete ${answer.value} collection?`).then(
      (confirm) => {
        if (confirm) {
          return deleteListCollectionHandler(rowName.id as number).then(
            async () => {
              const collections = await getCollectionsHandler(
                dbTables.listCollection
              );
              clearAnswers({ rowName: true });
              updateArguments({
                area: 'list',
                action: collections.length > 0 ? actions.delete : undefined,
              });
              startQuestions();
            }
          );
        }

        clearAnswers({ rowName: true });
        updateArguments({
          area: 'list',
          action: actions.delete,
        });
        startQuestions();
      }
    );
  }
  // Lists exist inside collection. Ask possibitlity to delete something inside the collection.
  return questionSelectRow(`Delete ${answer.value} collection?`, [
    {
      name: 'Yes!',
      value: true,
    },
    {
      name: `No I want to delete someting inside '${answer.value}' collection`,
      value: false,
    },
  ]).then(async (answer) => {
    if (answer) {
      return deleteListCollectionHandler(rowName.id as number).then(
        async () => {
          const collections = await getCollectionsHandler(
            dbTables.listCollection
          );
          clearAnswers({ rowName: true });
          updateArguments({
            area: 'list',
            action: collections.length > 0 ? actions.delete : undefined,
          });
          startQuestions();
        }
      );
    }

    return 'delete lists';
  });
};

export default deleteCollectionFlow;
