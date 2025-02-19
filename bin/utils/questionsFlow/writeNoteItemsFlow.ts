import type { IBaseData } from '../../types/types.d.ts';
import editorQuestion from '../editorQuestion.ts';
import { createHandlerItems } from '../handlers/createHandler.ts';

const writeNoteItemsFlow = async ({
  tableName,
  rowName,
}: IBaseData): Promise<ReturnType<typeof editorQuestion> | string> => {
  return editorQuestion({
    tableName,
    rowName: rowName as { id: string; value: string },
    question: 0,
  }).then((answer) => {
    if (answer.length === 0) {
      console.log('The note needs to contain at least something');

      return writeNoteItemsFlow({ tableName, rowName });
    }

    return answer;
  });
};

export default writeNoteItemsFlow;
