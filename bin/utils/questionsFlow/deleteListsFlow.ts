import questionSelectRow from '../questions/questionSelectRow.ts';
import { getPreviousAnswers } from '../../index.ts';
import { getListsRelatedToListCollection } from '../handlers/getHandler.ts';
import { deleteListCollectionHandler } from '../handlers/deleteHandler.ts';
import confirmQuestion from '../questions/confirmQuestion.ts';
import chalk from 'chalk';

const deleteListsFlow = async () => {
  const choices = lists.map((list) => ({
    name: list.name,
    value: { id: list.id, value: list.name },
  }));
  return questionSelectRow('What do you want to delete?', choices);
};

export default deleteListsFlow;
