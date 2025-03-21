import questionSelectRow from '../questions/questionSelectRow.ts';
import {
  clearAnswers,
  getPreviousAnswers,
  startQuestions,
  updateArguments,
  updatePreviousAnswers,
} from '../../index.ts';
import {
  getListHandler,
  getListItemsRelatedToListHandler,
} from '../handlers/getHandler.ts';
import confirmQuestion from '../questions/confirmQuestion.ts';
import { deleteListHandler } from '../handlers/deleteHandler.ts';
import { actions } from '../consts.ts';

const deleteListsFlow = async () => {
  const { lists, rowName } = getPreviousAnswers();

  // Delete list
  const choices = lists?.map((list) => ({
    name: list.name,
    value: { id: list.id, value: list.name },
  }));

  return questionSelectRow('Pick list to delete', choices).then(
    async (answer) => {
      const list = await getListHandler(answer.id);
      const items = await getListItemsRelatedToListHandler(list.id);

      updatePreviousAnswers({ list, listItems: items });

      if (items.length === 0) {
        return confirmQuestion(`Delete ${answer.value} list?`).then(
          async (confirm) => {
            if (confirm) {
              const listLengthBeforeDeleting = Number(lists?.length);
              return deleteListHandler(rowName.id as number, list.id).then(
                () => {
                  clearAnswers({ list: true, listItems: true });
                  updateArguments({
                    area: 'list',
                    collection: rowName.value as string,
                    list: '*',
                    action:
                      listLengthBeforeDeleting > 1 ? actions.delete : undefined,
                  });
                  startQuestions();
                }
              );
            }

            clearAnswers({ list: true, listItems: true });
            updateArguments({
              area: 'list',
              collection: rowName.value as string,
              list: '*',
              action: actions.delete,
            });
            startQuestions();
          }
        );
      }

      return questionSelectRow(`Delete ${answer.value} list?`, [
        {
          name: 'Yes!',
          value: true,
        },
        {
          name: `No I want to delete someting inside '${answer.value}' list`,
          value: false,
        },
      ]).then(async (confirm) => {
        const { list } = getPreviousAnswers();

        if (!list) process.exit();

        if (confirm) {
          return deleteListHandler(rowName.id as number, list.id).then(
            async () => {
              const listLengthBeforeDeleting = Number(lists?.length);
              clearAnswers({ list: true, listItems: true });
              updateArguments({
                area: 'list',
                collection: rowName.value as string,
                list: '*',
                action:
                  listLengthBeforeDeleting > 1 ? actions.delete : undefined,
              });
              startQuestions();
            }
          );
        }

        return 'delete items';
      });
    }
  );
};

export default deleteListsFlow;
