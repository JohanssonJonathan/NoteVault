import { notesTables } from '../../dummyData/notesTables.ts';
import { actions, value } from '../consts.ts';
import { todoTables } from '../../dummyData/todoTables.ts';

interface IFindCollection {
  name: string;
  tableName: string;
}

const findCollection = ({ name, tableName }: IFindCollection): Promise<any> => {
  // should be handled in db later
  return new Promise((resolve) => {
    if (tableName === value.list) {
      const alreadyExist = todoTables.find(
        ({ name: existingName }) =>
          existingName.toLowerCase() === name.toLowerCase()
      );

      if (alreadyExist) {
        resolve(true);
      } else {
        resolve(null);
      }
    }

    const alreadyExist = notesTables.find(
      ({ name: existingName }) =>
        existingName.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExist) {
      resolve(true);
    } else {
      resolve(null);
    }
  });
};

export default findCollection;
