import confirmQuestion from '../questions/confirmQuestion.ts';
import { value } from '../consts.ts';
import inputQuestion from '../questions/inputQuestion.ts';
import type { TTables } from '../../types/types.d.ts';
import writeListItemsFlow from './writeListItemsFlow.ts';
import {
  createHandlerCollection,
  createHandlerItems,
} from '../handlers/createHandler.ts';
import type { ICreatedListItem } from '../dbIntegrations/createItemsInCollectionList.ts';
import writeNoteItemsFlow from './writeNoteItemsFlow.ts';

const emptyTableFlow = async (tableName: TTables) => {
  const rowName: { value?: string; id?: string } = {};
  return confirmQuestion({ tableName, question: 0 })
    .then((answer) => {
      if (!answer) {
        // quit program !!!
        process.exit();
      }

      return true;
    })
    .then(() =>
      inputQuestion({
        tableName,
        question: 0,
        validate: true,
      })
    )
    .then((answer) => {
      rowName.value = answer;
      return createHandlerCollection({ tableName, rowName: answer });
    })
    .then((data) => {
      if (!data) {
        console.log('Where not able to create new collection');
        process.exit();
      }

      rowName.id = data.id;
      rowName.value = data.name;
      return true;
    })
    .then(async () => {
      if (tableName === value.list) {
        return writeListItemsFlow({
          tableName,
          rowName: rowName as { id: string; value: string },
        }).then((response) => {
          const value = response as ICreatedListItem | null;
          if (!value) {
            console.log('Something went wrong with adding the list');
            return null;
          }

          console.log('Created list successfully!');
          console.log('Title: ', rowName.value);
          value.items?.map(({ name }) => console.log(`* ${name}`));
          //
          process.exit();
        });
      }

      let note: string;
      return writeNoteItemsFlow({
        tableName,
        rowName: rowName as { id: string; value: string },
      })
        .then((answer) => {
          note = answer as string;
          return inputQuestion({ question: 5, tableName, validate: true });
        })
        .then((answer) =>
          createHandlerItems({
            note: { note: note, title: answer },
            rowName: rowName as { id: string; value: string },
          })
        )
        .then((answer) => {
          console.log('created: ', answer);
        });
    });
};

export default emptyTableFlow;
