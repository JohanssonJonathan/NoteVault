import type { IListRow, INoteRow } from '../../types/types.d.ts';
import { getPreviousAnswers, updatePreviousAnswers } from '../../index.ts';
import questionSelectRow from '../questions/questionSelectRow.ts';

interface IShowListsFlow {
  data: IListRow[] | INoteRow[];
}

const showListsFlow = async ({ data }: IShowListsFlow) => {
  const { rowName } = getPreviousAnswers();
  const currentRow = data.find((value) => value.id === rowName.id);

  const listRow = currentRow as IListRow;
  return questionSelectRow({
    choices: listRow.lists.map(({ id, created }) => ({
      name: created.toString(),
      value: { id, value: id },
    })),
    question: 0,
  }).then((answer) => {
    const currentListItem = listRow.lists.find(({ id }) => id === answer.id);

    updatePreviousAnswers({ list: currentListItem });

    console.log('');
    console.log('Name: ', currentListItem?.created);
    currentListItem?.items.map(({ name }) => console.log(`* ${name}`));
    console.log('');

    return true;
  });
};

export default showListsFlow;
