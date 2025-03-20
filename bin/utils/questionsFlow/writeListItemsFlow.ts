import inputQuestion from '../questions/inputQuestion.ts';
import confirmQuestion from '../questions/confirmQuestion.ts';
import { questions } from '../consts.ts';
import { getPreviousAnswers } from '../../index.ts';
import { createListItemsHandler } from '../handlers/createHandler.ts';
import type { IList, IListItem } from '../../types/types.d.ts';

interface IWriteListItemsFlow {
  items?: Omit<IListItem, 'id'>[];
  listId?: number;
  toggle?: boolean;
}

const writeListItemsFlow = async ({
  items = [],
  listId,
  toggle,
}: IWriteListItemsFlow): Promise<// | ReturnType<typeof inputQuestion>
{
  list: IList;
  items: IListItem[];
}> => {
  return inputQuestion({
    message: questions()[items.length ? 6 : 5],
    validate: items.length === 0,
  })
    .then(async (name: string) => {
      if (name.length === 0) {
        return {
          name,
          created: Date.now(),
        };
      }
      return inputQuestion({
        message: 'Add link',
        value: '(blank)',
      }).then((link: string) => {
        console.log('link: ', link);
        if (link !== '(blank)' && link.length !== 0) {
          return {
            name,
            link,
            created: Date.now(),
            isDone: toggle ? 0 : undefined,
          };
        }
        return {
          name,
          created: Date.now(),
          isDone: toggle ? 0 : undefined,
        };
      });
    })
    .then(async (answer) => {
      if (answer.name) {
        return writeListItemsFlow({
          items: [{ ...answer }, ...items],
          listId,
          toggle,
        });
      }

      return confirmQuestion('Are you done adding items?').then(
        async (answer) => {
          if (answer) {
            if (listId) {
              console.log('update specifc id');
              // return updateHandlerListItems({
              //   tableName,
              //   rowId: rowName.id,
              //   listId,
              //   items,
              // });
            }

            const { list } = getPreviousAnswers();

            return createListItemsHandler(
              list.id,
              items.map((item) => ({
                name: item.name,
                created: item.created,
                link: item.link || undefined,
                isDone:
                  typeof item.isDone === 'number' ? item.isDone : undefined,
              }))
            );
          }

          return writeListItemsFlow({ items });
        }
      );
    });
};

export default writeListItemsFlow;
