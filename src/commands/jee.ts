import { Context } from 'telegraf';
import createDebug from 'debug';

import { name } from '../../package.json'; // Assuming 'name' is already imported from package.json

const debug = createDebug('bot:jee_command');

const jee = () => async (ctx: Context) => {
  const message = `*${name} JEE Resources*:
  
  \n\n
  **For JEE quizzes**, use the command: \`/quizzes\`
  
  **Join Test Series** from the following links:
  1. Akash Test Series - [Link](https://test-series.pages.dev)
  2. Allen Test Series - [Link](https://test-series.pages.dev)
  3. PW Test Series - [Link](https://test-series.pages.dev)
  4. Modules and More - [Link](https://test-series.pages.dev)

  **JEE Study Groups**: Use the command: \`/groups\`
  
  **To list all available commands**, use: \`/list\`
  `;

  debug(`Triggered "jee" command with message \n${message}`);
  
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

export { jee };
