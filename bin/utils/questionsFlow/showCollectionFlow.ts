import type { TTables } from '../../types/types.d.ts';
import questionSelectRow from '../questions/questionSelectRow.ts';
import { value } from '../consts.ts';
import type { IListRow, INoteRow } from '../../types/types.d.ts';
import { updatePreviousAnswers } from '../../index.ts';

const showCollectionFlow = async (
  tableName: TTables,
  data: IListRow[] | INoteRow[]
) => {
  const choices = data.map(({ id, name }) => ({
    name,
    value: { id, value: name },
  }));

  return questionSelectRow({ choices, question: 0 }).then((answer) => {
    const rowName = {
      id: answer.id,
      value: answer.value,
    };
    updatePreviousAnswers({ rowName });

    const currentRow = data.find((value) => value.id === rowName.id);

    if (tableName === value.list) {
      const listRow = currentRow as IListRow;

      console.log('');
      console.log('These are your lists inside: ', rowName.value);
      console.log(`You have ${listRow.lists.length} at the moment`);
      console.log(`............................................`);
      console.log('');
      listRow.lists.map((value) => {
        console.log(value.created);
      });

      console.log(`............................................`);
      console.log('');
    } else {
      const noteRow = currentRow as INoteRow;

      console.log('');
      console.log('These are your notes inside: ', rowName.value);
      console.log(`You have ${noteRow.notes.length} at the moment`);
      console.log(`............................................`);
      console.log('');
      noteRow.notes.map((value) => {
        console.log(value.title);
      });
      console.log(`............................................`);
      console.log('');
    }
    return true;
  });
};

export default showCollectionFlow;
