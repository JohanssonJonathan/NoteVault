// import type { TTables } from '../../types/types.d.ts';
import { deleteHandlerCollection } from '../handlers/deleteHandler.ts';
import confirmQuestion from '../questions/confirmQuestion.ts';
// import questionSelectRow from '../questions/questionSelectRow.ts';
// import { questions } from '../consts.ts';
import { getPreviousAnswers } from '../../index.ts';

// interface IDeleteCollectionFlow {
//   tableName: TTables;
//   rowName: { id: string; value: string };
// }

export const deleteCollectionFlow = async () => {
  const { rowName, tableName } = getPreviousAnswers();
  return confirmQuestion({
    message: `Are you sure you want to delete ${rowName.value} in ${tableName}?`,
  })
    .then((answer) => {
      if (answer) {
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
        console.log(`Deleted ${rowName.value} in ${tableName} successfully!`);
      }

      return;
    });
};

// export const deleteListFlow = async ({
//   data,
//   tableName,
// }: IDeleteCollectionFlow) => {
//   let rowName: { id?: string; value?: string } = {};
//   const choices = data.map(({ id, name }) => ({
//     name,
//     value: { id, value: name },
//   }));
//
//   return questionSelectRow({ choices, message: questions[0] }).then(
//     async (answer) => {
//       rowName.id = answer.id;
//       rowName.value = answer.value;
//
//       return confirmQuestion({
//         tableName,
//         rowName: rowName.value,
//         question: 4,
//       })
//         .then((confirm) => {
//           if (confirm) {
//             return deleteHandlerCollection({
//               tableName,
//               rowId: rowName.id as string,
//             });
//           }
//
//           process.exit();
//         })
//         .then((data) => data);
//     }
//   );
// };
//
export const deleteNoteFlow = () => {};
