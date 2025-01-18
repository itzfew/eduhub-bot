import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:poll');

// Poll function
const poll = () => async (ctx: Context) => {
  debug('Triggered "poll" command');

  const messageId = ctx.message?.message_id;
  const userName = `${ctx.message?.from.first_name}`;
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (messageId) {
    if (userMessage) {
      // Process poll related text commands
      if (userMessage.includes('/poll')) {
        await ctx.reply(`Hey ${userName}, let's start a poll! Please send me the poll question followed by the options. For example:
        \nExample: "What's your favorite color? Red, Blue, Green"`);
      } else if (userMessage.includes('vote') || userMessage.includes('poll') || userMessage.includes('yes') || userMessage.includes('no')) {
        const pollOptions = ['Option 1', 'Option 2', 'Option 3'];

        // Send the poll question and options
        await ctx.replyWithPoll(
          `${userName} is asking a question!`, 
          pollOptions,
          { is_anonymous: false, type: 'regular' }
        );
      } else if (userMessage.includes('/results')) {
        await ctx.reply('Results will be shown after voting.');
      }
    } else {
      // Handle non-text messages (e.g., media)
      await ctx.reply(`I can only respond to text messages. Please send a text command.`);
    }
  }
};

export { poll };
