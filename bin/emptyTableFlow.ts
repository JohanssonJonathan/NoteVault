import confirmQuestion from './utils/confirmQuestion.ts';
import createHandler from './utils/handlers/createHandler.ts';
import { value } from './utils/consts.ts';
import inputQuestion, { inputQuestionLoop } from './utils/inputQuestion.ts';
import editorQuestion from './utils/editorQuestion.ts';
import type { TTables } from './types.d.ts';

const emptyTableFlow = async (tableName: TTables) => {
  return confirmQuestion({ tableName, question: 0 })
    .then(({ data, answer }) => {
      if (!answer) {
        // quit program !!!
        process.exit();
      }

      return data;
    })
    .then((data) =>
      inputQuestion({
        tableName: data.tableName,
        question: 0,
        validate: true,
      })
    )
    .then(({ answer, data }) =>
      createHandler({ tableName: data.tableName, name: answer })
    )
    .then((data) => {
      if (data) {
        const { data: currentData, created } = data;

        return confirmQuestion({
          tableName: currentData.tableName,
          rowName: { value: created.name, id: created.id },
          question: 1,
        });
      }

      console.log('Where not able to create new collection');
      process.exit();
    })
    .then((answer) => {
      if (!answer.answer) {
        // quit program !!!
        process.exit();
      }

      return answer.data;
    })
    .then((data) => {
      // write your first item todo
      if (data.tableName === value.list) {
        return inputQuestion({
          tableName: data.tableName,
          rowName: data.rowName,
          question: 3,
          validate: true,
        }).then(({ answer, data }) =>
          inputQuestionLoop({
            tableName: data.tableName,
            rowName: data.rowName,
            items: [answer, ...data.items],
            question: 4,
          })
        );
      }

      return editorQuestion({
        tableName: data.tableName,
        rowName: data.rowName,
        question: 3,
      });
      // write your note in an editor
    })
    .then(({ answer, data }) => {
      console.log('data: ', data);

      console.log('answer: ', answer);
    });
};

export default emptyTableFlow;
