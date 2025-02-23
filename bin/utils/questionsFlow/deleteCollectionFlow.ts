import type { TTables } from '../../types/types.d.ts';
import { deleteHandlerCollection } from '../handlers/deleteHandler.ts';
import confirmQuestion from '../questions/confirmQuestion.ts';
import questionSelectRow from '../questions/questionSelectRow.ts';

interface IDeleteCollectionFlow {
  tableName: TTables;
  rowName: { id: string; value: string };
}

export const deleteCollectionFlow = async ({
  tableName,
  rowName,
}: IDeleteCollectionFlow) => {
  return confirmQuestion({
    tableName,
    rowName: rowName.value,
    question: 4,
  })
    .then((answer) => {
      if (answer) {
        console.log('tableName ', tableName);
        console.log('rowname ', rowName.id);
        return deleteHandlerCollection({
          tableName,
          rowId: rowName.id as string,
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

export const deleteListFlow = ({ data, tableName }: IDeleteCollectionFlow) => {
  let rowName: { id?: string; value?: string } = {};
  const choices = data.map(({ id, name }) => ({
    name,
    value: { id, value: name },
  }));

  return questionSelectRow({ choices, question: 0 }).then(async (answer) => {
    rowName.id = answer.id;
    rowName.value = answer.value;

    return confirmQuestion({
      tableName,
      rowName: rowName.value,
      question: 4,
    })
      .then((confirm) => {
        if (confirm) {
          return deleteHandlerCollection({
            tableName,
            rowId: rowName.id as string,
          });
        }

        process.exit();
      })
      .then((data) => data);
  });
};

export const deleteNoteFlow = () => {};
