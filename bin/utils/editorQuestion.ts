import inquirer from 'inquirer';

interface IConfirmQuestion {
  message: string;
  validate?: boolean;
}

const editorQuestion = async ({ message, validate }: IConfirmQuestion) => {
  return inquirer
    .prompt([
      {
        type: 'editor',
        name: 'editor',
        message,
        validate: (value) => {
          if (validate) {
            return Boolean(value.length);
          }

          return true;
        },
      },
    ])
    .then((answers) => {
      return answers.editor;
    });
};

export default editorQuestion;
