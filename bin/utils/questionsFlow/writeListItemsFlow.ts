import inputQuestion from '../questions/inputQuestion.ts';
import confirmQuestion from '../questions/confirmQuestion.ts';
import { questions } from '../consts.ts';
import { getPreviousAnswers } from '../../index.ts';
import { questionSelectRow } from '../questionSelectRow.ts';
import { createListItemsHandler } from '../handlers/createHandler.ts';
import type { IListItem } from '../../types/types.d.ts';

interface IWriteListItemsFlow {
  items?: Omit<IListItem, 'id'>[];
  listId?: number;
  toggle?: boolean;
}

const writeListItemsFlow = async ({
  items = [],
  listId,
  toggle,
}: IWriteListItemsFlow): Promise<
  | ReturnType<typeof inputQuestion>
  | {
      id: string;
      created: Date;
      items?: { id: string; name: string }[];
    }
  | null
> => {
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
            isDone: toggle ? false : undefined,
          };
        }
        return {
          name,
          created: Date.now(),
          isDone: toggle ? false : undefined,
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
                  typeof item.isDone === 'boolean' ? item.isDone : undefined,
              }))
            );
            // return createHandlerItems({
            //   items,
            //   rowName: rowName as { id: string; value: string },
            //   id: listId,
            // }).then((answer) => {
            //   return answer;
            // });
          }

          return writeListItemsFlow({ items });
        }
      );
    });
};

export default writeListItemsFlow;
