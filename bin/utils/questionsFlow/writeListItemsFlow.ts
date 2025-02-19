import inputQuestion from '../questions/inputQuestion.ts';
import type { IBaseData } from '../../types/types.d.ts';
import confirmQuestion from '../questions/confirmQuestion.ts';
import { createHandlerItems } from '../handlers/createHandler.ts';

interface IWriteListItemFlow extends IBaseData {
  items?: string[];
}

const writeListItemsFlow = async ({
  tableName,
  rowName,
  items = [],
}: IWriteListItemFlow): Promise<
  | ReturnType<typeof inputQuestion>
  | {
      id: string;
      created: Date;
      items?: { id: string; name: string }[];
    }
  | null
> => {
  return inputQuestion({
    tableName,
    rowName,
    items,
    question: items.length ? 4 : 3,
    validate: items.length === 0,
  }).then(async (answer) => {
    if (answer) {
      return writeListItemsFlow({
        tableName,
        rowName,
        items: [answer, ...items],
      });
    }

    return confirmQuestion({
      tableName,
      rowName,
      items,
      question: 6,
    }).then(async (answer) => {
      if (answer) {
        return createHandlerItems({
          items,
          rowName: rowName as { id: string; value: string },
        }).then((answer) => {
          return answer;
        });
      }

      return writeListItemsFlow({
        tableName,
        rowName,
        items,
      });
    });
  });
};

export default writeListItemsFlow;
