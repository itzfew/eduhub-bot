import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:greeting');
const CHANNEL_ID = '@eduhub2025'; // Replace with your channel username or numeric ID

const greeting = () => async (ctx: Context) => {
  debug('Triggered "greeting" with keyword-based forwarding');

  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;
  const userName = `${ctx.message?.from.first_name}`;

  if (ctx.chat?.id && userMessage) {
    try {
      const keyword = userMessage.trim();
      if (keyword) {
        debug(`Searching for keyword: "${keyword}" in channel: ${CHANNEL_ID}`);
        
        // Placeholder for your search logic
        const matchingMessage = null; // You need to implement message search storage or API fetch
        
        if (matchingMessage) {
          await ctx.telegram.forwardMessage(ctx.chat.id, CHANNEL_ID, matchingMessage.message_id);
        } else {
          await ctx.reply(`Sorry ${userName}, I couldn't find any message containing "${keyword}" in the channel.`);
        }
      } else {
        await ctx.reply(`Hi ${userName}, please provide a valid keyword to search for messages.`);
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      debug(`Error occurred: ${errMsg}`);
      await ctx.reply(`Oops! Something went wrong: ${errMsg}`);
    }
  } else {
    await ctx.reply(`I can only process text messages. Please send a valid keyword.`);
  }
};

export { greeting };
