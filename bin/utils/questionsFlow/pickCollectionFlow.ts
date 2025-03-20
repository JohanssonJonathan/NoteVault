import type { ICollectionRow } from '../../types/types.d.ts';
import questionSelectRow from '../questions/questionSelectRow.ts';
import { getPreviousAnswers } from '../../index.ts';
import { actions } from '../consts.ts';
import confirmQuestion from '../questions/confirmQuestion.ts';
import chalk from 'chalk';
import { getPreviousArguments } from '../../index.ts';

const pickCollectionFlow = async (data: ICollectionRow[]) => {
  const { action } = getPreviousAnswers();

  const { collection: selectedListCollection } = getPreviousArguments();

  if (selectedListCollection) {
    const foundCollection = data.find(
      ({ name }) => name === selectedListCollection
    );

    if (foundCollection) {
      return { id: foundCollection.id, value: foundCollection.name };
    }

    console.log(`Could not find ${selectedListCollection}`);
    process.exit();
  }

  if (action === actions.read) {
    return questionSelectRow('Your current collections', [
      ...data.map(({ id, name }) => ({
        name,
        value: { id, value: name },
      })),
    ]);
  }

  if (action === actions.write) {
    const isEmpty = data.length === 0;

    if (isEmpty) {
      return confirmQuestion(
        'You dont have any collections. Do you want to create your first?'
      ).then((answer) => {
        if (answer) {
          return { new: true };
        }

        process.exit();
      });
    }

    return questionSelectRow(
      'Pick the collection',
      [
        ...data.map(({ id, name }) => ({
          name,
          value: { id, value: name },
        })),
      ],
      [
        {
          name: chalk.italic('I want to create a new collection'),
          value: { new: true },
        },
      ]
    );
  }

  if (action === actions.delete) {
    return questionSelectRow('Pick the collection', [
      ...data.map(({ id, name }) => ({
        name,
        value: { id, value: name },
      })),
    ]);
  }
};

export default pickCollectionFlow;
