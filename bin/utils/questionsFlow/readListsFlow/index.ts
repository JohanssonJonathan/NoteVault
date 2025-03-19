import questionSelectRow from '../../questions/questionSelectRow.ts';
import {
  getListHandler,
  getListItemsRelatedToListHandler,
  getListsRelatedToListCollection,
} from '../../handlers/getHandler.ts';
import confirmQuestion from '../../questions/confirmQuestion.ts';
import inputQuestion from '../../questions/inputQuestion.ts';
import { getPreviousAnswers, updatePreviousAnswers } from '../../../index.ts';
import { createListHandler } from '../../handlers/createHandler.ts';
import writeItemsFlow from '../writeItemsFlow.ts';

const readListsFlow = async (answer: { id: number; value: string }) => {
  const lists = await getListsRelatedToListCollection(answer.id);
  const { rowName } = getPreviousAnswers();

  if (lists.length === 0) {
    return confirmQuestion(
      `You dont have any lists inside ${answer.value}. Do you want to create?`
    ).then(async (answer) => {
      if (answer) {
        return inputQuestion({
          message: 'Write a name of the list',
          validate: true,
        })
          .then((answer) => createListHandler(rowName.id as number, answer))
          .then((result) => {
            if (result.list) {
              updatePreviousAnswers({ list: result.list });

              return writeItemsFlow({});
            }
          });
      }

      process.exit();
    });
  }

  const choices = lists.map((list) => ({
    name: list.name,
    value: { id: list.id, value: list.name },
  }));

  return questionSelectRow(
    `These are your lists inside ${answer.value}`,
    choices
  )
    .then((answer) => getListHandler(answer.id))
    .then((data) => {
      updatePreviousAnswers({ list: data });
      return getListItemsRelatedToListHandler(data.id);
    })
    .then(async (items) => {
      const { list } = getPreviousAnswers();

      console.log('listItems: ', items);
      if (items.length === 0) {
        return confirmQuestion(
          `There are no items inside ${list}. Do you want to create?`
        ).then(async (confirm) => {
          if (confirm) {
            return confirmQuestion(
              'Do you want your list to have the possibility to toggle on or off functionallity?'
            ).then((confirm) => {
              return writeItemsFlow({ toggle: confirm });
            });
          }

          process.exit();
        });
      }

      const choices = items.map((item) => ({
        name: item.name,
        value: { id: item.id, value: item.name },
      }));
      return questionSelectRow(
        `These are your items inside ${list.name}`,
        [...choices],
        [{ name: 'Create a new item', value: { new: true } }]
      ).then((answer) => {
        if (answer.new) {
          // Create a new item inside the same

          const isToggling = items.find(
            (item) => typeof item.isDone === 'boolean'
          );

          return writeItemsFlow({ toggle: Boolean(isToggling) });
        }
      });
    });
};

export default readListsFlow;
