import confirmQuestion from '../questions/confirmQuestion.ts';
import { getPreviousAnswers } from '../../index.ts';
import { deleteHandlerItems } from '../handlers/deleteHandler.ts';

export const deleteItemsFlow = async () => {
  const { tableName, rowName, list } = getPreviousAnswers();
  return confirmQuestion({
    tableName,
    rowName: rowName.value,
    question: 8,
  })
    .then((answer) => {
      if (answer) {
        console.log('tableName ', tableName);
        console.log('rowname ', rowName.id);
        return deleteHandlerItems({
          tableName,
          rowId: rowName.id as string,
          id: list.id,
        });
      }
    })
    .then((data) => {
      if (!data) {
        console.log('Something went wrong with deleting the collection');
      } else {
        console.log('Collection deleted successfully!');
      }

      return;
    });
};

export const deleteNoteFlow = () => {};
