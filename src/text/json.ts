import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:json');

// Main JSON function
const json = () => async (ctx: Context) => {
  debug('Triggered "json" command');

  const userName = `${ctx.message?.from.first_name}`;
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (userMessage === '/json') {
    // Create a JSON object with relevant user data
    const userJson = {
      user: {
        firstName: ctx.message?.from.first_name,
        lastName: ctx.message?.from.last_name,
        username: ctx.message?.from.username,
        id: ctx.message?.from.id
      },
      message: {
        text: ctx.message?.text, // safely access the text
        date: ctx.message?.date
      }
    };

    // Send JSON object as a message
    await ctx.reply(JSON.stringify(userJson, null, 2)); // Pretty print the JSON with 2 spaces
  } else {
    await ctx.reply(`Please type /json to see your message in JSON format.`);
  }
};

export { json };
