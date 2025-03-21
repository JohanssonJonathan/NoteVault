import questionSelectRow from '../questions/questionSelectRow.ts';
import { value } from '../consts.ts';
import type { IListRow, INoteRow } from '../../types/types.d.ts';
import { updatePreviousAnswers, getPreviousAnswers } from '../../index.ts';

const showCollectionFlow = async (data: IListRow[] | INoteRow[]) => {
  const { tableName } = getPreviousAnswers();
  const choices = data.map(({ id, name }) => ({
    name,
    value: { id, value: name },
  }));

  return questionSelectRow('Pick collection', choices).then((answer) => {
    const rowName = {
      id: answer.id,
      value: answer.value,
    };
    updatePreviousAnswers({ rowName });

    const currentRow = data.find((value) => value.id === rowName.id);

    if (tableName === value.list) {
      const listRow = currentRow as IListRow;

      console.log('');
      console.log(
        'These are your lists inside the selected collection: ',
        rowName.value
      );
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
      console.log(
        'These are your notes inside the selected collection: ',
        rowName.value
      );
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
