import boxen from 'boxen';
import chalk from 'chalk';

export const errorMessage = (message: string) =>
  console.log(
    boxen(message, {
      title: chalk.red('Error'),
      padding: 1,
      titleAlignment: 'center',
    })
  );

export const successfullMesage = (message: string) =>
  console.log(
    boxen(message, {
      title: chalk.green('Successfully'),
      padding: 1,
      titleAlignment: 'center',
    })
  );
