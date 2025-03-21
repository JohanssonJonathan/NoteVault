import {
  clearAnswers,
  getPreviousAnswers,
  startQuestions,
  updateArguments,
} from '../../index.ts';
import questionSelectRow from '../questions/questionSelectRow.ts';
import confirmQuestion from '../questions/confirmQuestion.ts';
import { deleteItemHandler } from '../handlers/deleteHandler.ts';
import { actions } from '../consts.ts';

export const deleteItemsFlow = async () => {
  const { list, listItems, rowName } = getPreviousAnswers();

  if (listItems === undefined || listItems.length === 0 || list === undefined)
    process.exit();

  const choices = listItems.map((item) => ({
    name: item.name,
    value: { id: item.id, value: item.name },
  }));

  const itemsLengthBeforeDeleting = Number(listItems?.length);
  return questionSelectRow(`Delete an item in ${list.name}`, [...choices]).then(
    async (answer) => {
      return confirmQuestion(
        `Are you sure you want to delete ${answer.value}?`
      ).then(async (confirm) => {
        if (confirm) {
          return deleteItemHandler(list.id, answer.id).then(() => {
            clearAnswers({ listItems: true });
            updateArguments({
              area: 'list',
              collection: rowName.value as string,
              list: list.name,
              listItem: '*',
              action:
                itemsLengthBeforeDeleting > 1 ? actions.delete : undefined,
            });
            startQuestions();
          });
        }

        clearAnswers({ listItems: true });
        updateArguments({
          area: 'list',
          collection: rowName.value as string,
          list: list.name,
          listItem: '*',
          action: actions.delete,
        });
        startQuestions();
      });
    }
  );
};
