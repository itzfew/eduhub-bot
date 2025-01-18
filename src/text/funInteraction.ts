import { Context } from 'telegraf';
import createDebug from 'debug';
import fetch from 'node-fetch';

const debug = createDebug('bot:fun_interaction');

// Main fun interaction function
const funInteraction = () => async (ctx: Context) => {
  debug('Triggered "fun_interaction" function');

  const messageId = ctx.message?.message_id;
  const userName = `${ctx.message?.from.first_name}`;

  // Get the message text or handle non-text messages
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (messageId) {
    if (userMessage) {
      // Process text messages only
      if (userMessage === '/joke') {
        // Fetch a random joke
        const response = await fetch('https://official-joke-api.appspot.com/random_joke');
        const jokeData = await response.json();
        await ctx.reply(`${jokeData.setup} - ${jokeData.punchline}`);
      }
      // If the message is not recognized, do nothing (no reply)
    } else {
      // Handle non-text messages (e.g., media)
      // If the message is not text, do nothing (no reply)
    }
  }
};

export { funInteraction };
