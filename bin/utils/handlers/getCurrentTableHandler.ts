import { value } from '../consts.ts';
import getTableList from '../dbIntegrations/getTableList.ts';
import getTableNotes from '../dbIntegrations/getTableNotes.ts';
import type { TInitialQuestionSelection } from '../initialQuestion.ts';

const getCurrentTableHandler = async (answer: TInitialQuestionSelection) => {
  if (value.list === answer.value) {
    // get everything related to "list" from the DB

    return await getTableList().then((data) => ({
      data,
      answer: {
        value: value.list,
        action: answer.action,
      },
    }));
  }

  return await getTableNotes().then((data) => ({
    data,
    answer: {
      value: value.note,
      action: answer.action,
    },
  }));
};

export default getCurrentTableHandler;
