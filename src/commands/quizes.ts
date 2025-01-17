import { Context } from 'telegraf';
import createDebug from 'debug';

import { name } from '../../package.json'; // Assuming 'name' is already imported from package.json

const debug = createDebug('bot:quizes_command');

const quizes = () => async (ctx: Context) => {
  const message = `*${name} Quizzes*:
  
  \n\n
  **Available Quizzes**: Access them at [Quizzes Link](https://quizes.pages.dev)
  
  **Available Exams**:
  - JEE Main Misc
  - JEE Main
  - NEET
  - BITSAT 
  
  **To list all available commands**, use: \`/list\`
  `;

  debug(`Triggered "quizes" command with message \n${message}`);
  
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

export { quizes };
