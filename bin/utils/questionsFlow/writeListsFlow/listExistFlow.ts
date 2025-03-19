import { getListItemsRelatedToListHandler } from '../../handlers/getHandler.ts';
import type { IList, IListItem } from '../../../types/types.d.ts';
import confirmQuestion from '../../questions/confirmQuestion.ts';
import inputQuestion from '../../questions/inputQuestion.ts';
import { getPreviousAnswers, updatePreviousAnswers } from '../../../index.ts';
import { createListHandler } from '../../handlers/createHandler.ts';
import writeItemsFlow from '../writeItemsFlow.ts';
import questionSelectRow from '../../questions/questionSelectRow.ts';

const listExistFlow = async (lists: IList[]) => {
  const { rowName } = getPreviousAnswers();

  // List exist
  const choices = lists.map((list) => ({
    name: list.name,
    value: { id: list.id, value: list.name },
  }));

  return questionSelectRow(
    'Here are your lists',
    [...choices],
    [
      {
        name: 'I want to create a new list',
        value: { new: true },
      },
    ]
  ).then(async (answer) => {
    if (answer.new) {
      return inputQuestion({
        message: 'Write a name for your list',
        validate: true,
      })
        .then((answer) => createListHandler(rowName.id as number, answer))
        .then((result) => {
          updatePreviousAnswers({ list: result.list });

          return confirmQuestion(
            'Do you want your list to have the possibility to toggle on or off functionallity?'
          );
        })
        .then((answer) => {
          return writeItemsFlow({ toggle: answer });
        });
    }

    const currentList = lists.find(({ id }) => id === answer.id);

    updatePreviousAnswers({ list: currentList });
    const { list } = getPreviousAnswers();

    const items = (await getListItemsRelatedToListHandler(
      currentList?.id as number
    )) as IListItem[];

    if (items.length === 0) {
      return confirmQuestion(
        `There are no items inside ${list.name}. Do you want create new ones?`
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
      `Select item or create a new one`,
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

export default listExistFlow;
