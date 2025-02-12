import type { IAnswerSelection } from '../types.d.ts';

export const answerHandler = async (answer: IAnswerSelection) => {
  // Should list all the todo collections.
  // Should give the opportunity to answer again on what to pick.

  try {
    // something new should be created but first we need a final input
    if (answer.new) {

        // ask the user what the name should be of the new thing.
    }

    // User has selected between existing options.
    if (answer.selection) {
    }

    // User has selected something that exist in the DB specific id.
    if (answer.id) {
    }

    console.log('answer: ', answer);
  } catch (err) {
    return { data: [], name: answer.name };
  }
};
