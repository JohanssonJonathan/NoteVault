// import questionSelectRow from '../questions/questionSelectRow.ts';
// import { getPreviousAnswers } from '../../index.ts';
// import { updatePreviousAnswers } from '../../index.ts';
// import { updateHandlerListItem } from '../handlers/updateHandler.ts';
// import inputQuestion from '../questions/inputQuestion.ts';
// import { deleteHandlerListItem } from '../handlers/deleteHandler.ts';
// import type { IListItem } from '../../types/types.d.ts';
// import { updateListItems } from '../dbIntegrations/update.ts';
// import inquirer from 'inquirer';
//
// const updateListItemsFlow = async (): ReturnType<typeof updateListItems> => {
//   const { list, tableName, rowName } = getPreviousAnswers();
//
//   return questionSelectRow('Pick the item you want to edit or delete', [
//     ...list.items.map((item) => ({
//       name: item.name,
//       value: { id: item.id, value: item.name },
//     })),
//     new inquirer.Separator(),
//     { name: 'Quit', value: { id: 'quit', value: 'quit' } },
//   ])
//     .then((answer) => {
//       if (answer.id === 'quit') {
//         return process.exit();
//       }
//       updatePreviousAnswers({
//         listItem: { id: answer.id, name: answer.value },
//       });
//       return inputQuestion({
//         value: answer.value,
//         message:
//           'Change as you wish. If you want to remove, keep it blank and press enter',
//       });
//     })
//     .then(async (answer) => {
//       const { listItem } = getPreviousAnswers();
//       if (answer) {
//         return updateHandlerListItem({
//           tableName,
//           rowId: rowName.id,
//           listId: list.id,
//           id: listItem.id,
//           value: answer,
//         })
//           .then((data: { listItem?: IListItem; listItems: IListItem[] }) => {
//             updatePreviousAnswers({
//               listItem: data.listItem,
//               list: {
//                 ...list,
//                 items: data.listItems,
//               },
//             });
//
//             const { list: updatedList } = getPreviousAnswers();
//             console.log('');
//             console.log('This is your updated items inside', rowName.value);
//             console.log(`............................................`);
//             console.log('');
//             updatedList.items.map((value) => {
//               console.log(`* ${value.name}`);
//             });
//
//             console.log(`............................................`);
//             console.log('');
//           })
//           .then(() => {
//             return updateListItemsFlow();
//           });
//       }
//
//       return deleteHandlerListItem({
//         tableName,
//         rowId: rowName.id,
//         listId: list.id,
//         id: listItem.id,
//       }).then((data: { deletedItem: IListItem; listItems: IListItem[] }) => {
//         updatePreviousAnswers({
//           listItem: undefined,
//           list: {
//             ...list,
//             items: data.listItems,
//           },
//         });
//
//         const { list: updatedList } = getPreviousAnswers();
//         console.log('');
//         console.log('This is your updated items inside', rowName.value);
//         console.log(`............................................`);
//         console.log('');
//         updatedList.items.map((value) => {
//           console.log(`* ${value.name}`);
//         });
//
//         console.log(`............................................`);
//         console.log('');
//         console.log('Deleted successfully: ', data);
//       });
//     })
//     .then(() => {
//       return updateListItemsFlow();
//     });
// };
//
// export default updateListItemsFlow;
