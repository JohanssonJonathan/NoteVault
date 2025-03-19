import { getPreviousAnswers } from '../../index.ts';
import { value } from '../consts.ts';
import inputQuestion from '../questions/inputQuestion.ts';
import writeListItemsFlow from './writeListItemsFlow.ts';
import type { ICreatedListItem } from '../dbIntegrations/createItemsInCollectionList.ts';
import writeNoteItemsFlow from './writeNoteItemsFlow.ts';

const writeItemsFlow = async ({
  listId,
  toggle,
}: {
  listId?: number;
  toggle?: boolean;
}) => {
  const { tableName, rowName } = getPreviousAnswers();

  if (tableName === value.list) {
    return writeListItemsFlow({ listId, toggle }).then((response) => {
      const value = response as ICreatedListItem | null;
      if (!value) {
        console.log('Something went wrong with adding the list');
        return null;
      }

      console.log('Created list successfully!');
      console.log('Title: ', rowName.value);
      value.items?.map(({ name }) => console.log(`* ${name}`));

      return true;
    });
  }

  let note: string;
  return (
    writeNoteItemsFlow({
      tableName,
      rowName: rowName as unknown as { id: string; value: string },
    })
      .then((answer) => {
        note = answer as string;
        return inputQuestion({
          message: 'Choose between the options',
          validate: true,
        });
      })
      // .then((answer) =>
      //   // createHandlerItems({
      //   //   note: { note: note, title: answer },
      //   //   rowName: rowName as { id: string; value: string },
      //   // })
      // )
      .then((answer) => {
        console.log('created: ', answer);

        process.exit();
      })
  );
};

export default writeItemsFlow;
