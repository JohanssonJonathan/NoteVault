import inquirer from 'inquirer';
import type {
  IData,
  ITodoRow,
  INotesRow,
  IAnswerSelection,
} from '../types.d.ts';

export const questionSelectRow = async (
  table: IData<ITodoRow[] | INotesRow[]>
): Promise<IAnswerSelection> => {
  const { data, name } = table;

  if (data.length === 0) {
    return inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'empty',
          message: `It seems you don't have any ${name === 'list' ? 'list' : 'notes'} collections yet. Do you want to create?`,
        },
      ])
      .then((answers) => {
        return {
          new: answers.empty ? true : false,
        };
      });
  }

  const choices: { value: IAnswerSelection; name: string }[] = [
    {
      name: 'Create a new one!',
      value: {
        new: true,
      },
    },
    ...data.map((row: ITodoRow | INotesRow) => ({
      name: row.name,
      value: {
        id: String(Math.random() * 100),
        name: row.name,
      },
    })),
  ];

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'selections',
        message: 'In what area would you like to add your note',
        choices,
      },
    ])
    .then((answers) => {
      console.log('answers: ', answers);
      return answers.selections;
    });
};
