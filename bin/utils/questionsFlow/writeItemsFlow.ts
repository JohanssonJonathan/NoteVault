import { getPreviousAnswers } from '../../index.ts';
import { value } from '../consts.ts';
import inputQuestion from '../questions/inputQuestion.ts';
import writeListItemsFlow from './writeListItemsFlow.ts';
import writeNoteItemsFlow from './writeNoteItemsFlow.ts';
import { getListItemsRelatedToListHandler } from '../handlers/getHandler.ts';

const writeItemsFlow = async ({
  listId,
  toggle,
}: {
  listId?: number;
  toggle?: boolean;
}) => {
  const { tableName, rowName } = getPreviousAnswers();

  if (tableName === value.list) {
    return writeListItemsFlow({ listId, toggle }).then(async (response) => {
      const items = await getListItemsRelatedToListHandler(response.list.id);
      const isToggle = items.find((item) => typeof item.isDone === 'number');
      console.log('Collection: ', rowName.value);
      console.log('_______________________');
      console.log('');
      console.log(`List: ${response.list.name}`);
      console.log('_______________________');
      console.log('');
      console.log('Created at: ', response.list.created);
      console.log('_______________________');
      console.log('');
      if (response.list.modified) {
        console.log('Modified at: ', response.list.modified);
      }

      console.log('');
      items.forEach((item) => {
        console.log('_______________________');
        console.log('');
        console.log(`* ${item.name}`);

        if (isToggle) {
          console.log('Is done: ', Boolean(item.isDone));
        }

        if (item.link) {
          console.log('Link: ', item.link);
        }
      });
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
