import type { IListRow, INoteRow } from '../../types/types.d.ts';
import questionSelectRow from '../questions/questionSelectRow.ts';
const pickCollectionFlow = async (data: INoteRow[] | IListRow[]) => {
  return questionSelectRow('Pick your collection', [
    {
      name: 'I want to create a new collection',
      value: { id: 'new', value: 'new' },
    },
    ...data.map(({ id, name }) => ({
      name,
      value: { id, value: name },
    })),
  ]);
};

export default pickCollectionFlow;
