import { getListsRelatedToListCollection } from '../../handlers/getHandler.ts';
import type { IList } from '../../../types/types.d.ts';
import listExistFlow from './listExistFlow.ts';
import noListFlow from './noListFlow.ts';

const writeListsFlow = async (answer: {
  id: number;
  value: string;
}) => {
  const lists = (await getListsRelatedToListCollection(answer.id)) as IList[];

  // No list exist
  if (lists.length === 0) {
    return noListFlow();
  }

  // List exists
  return listExistFlow(lists);
};

export default writeListsFlow;
