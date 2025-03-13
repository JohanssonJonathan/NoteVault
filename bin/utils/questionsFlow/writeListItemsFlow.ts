import inputQuestion from '../questions/inputQuestion.ts';
import confirmQuestion from '../questions/confirmQuestion.ts';
import { createHandlerItems } from '../handlers/createHandler.ts';
import { questions } from '../consts.ts';
import { getPreviousAnswers } from '../../index.ts';
import { updateListItems } from '../dbIntegrations/update.ts';
import { updateHandlerListItems } from '../handlers/updateHandler.ts';

interface IWriteListItemsFlow {
  items?: string[];
  listId?: string;
}

const writeListItemsFlow = async ({
  items = [],
  listId,
}: IWriteListItemsFlow): Promise<
  | ReturnType<typeof inputQuestion>
  | {
      id: string;
      created: Date;
      items?: { id: string; name: string }[];
    }
  | null
> => {
  const { tableName, rowName } = getPreviousAnswers();
  return inputQuestion({
    items,
    message: questions()[items.length ? 6 : 5],
    validate: items.length === 0,
  }).then(async (answer) => {
    if (answer) {
      return writeListItemsFlow({
        items: [answer, ...items],
        listId,
      });
    }

    return confirmQuestion({
      message: 'Are you done adding items?',
    }).then(async (answer) => {
      if (answer) {
        if (listId) {
          return updateHandlerListItems({
            tableName,
            rowId: rowName.id,
            listId,
            items,
          });
        }
        return createHandlerItems({
          items,
          rowName: rowName as { id: string; value: string },
          id: listId,
        }).then((answer) => {
          return answer;
        });
      }

      return writeListItemsFlow({ items });
    });
  });
};

export default writeListItemsFlow;
