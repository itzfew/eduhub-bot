import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:poll');

// Main poll function
const poll = () => async (ctx: Context) => {
  debug('Triggered "poll" command');

  const messageId = ctx.message?.message_id;
  const userName = `${ctx.message?.from.first_name}`;

  // Get the message text or handle non-text messages
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (messageId) {
    if (userMessage) {
      // Process text messages only
      if (userMessage === '/startpoll') {
        // Poll question and options
        const question = "What is your favorite color?";
        const options = ["Red", "Blue", "Green", "Yellow"];

        // Ensure the chat_id is valid before sending the poll
        const chatId = ctx.chat?.id;

        if (chatId !== undefined) {
          try {
            // Send poll to the user
            await ctx.telegram.sendPoll(chatId, question, options, {
              is_anonymous: true,
              allows_multiple_answers: false,
            });
          } catch (error) {
            debug('Error sending poll:', error);
            await ctx.reply('Something went wrong while sending the poll.');
          }
        } else {
          await ctx.reply('Chat ID is not valid. Please try again later.');
        }
      } else if (userMessage.includes('poll')) {
        await ctx.reply(`Hey ${userName}, I can help you create a poll. Type /startpoll to begin!`);
      }
    } else {
      // Handle non-text messages (e.g., media)
      await ctx.reply(`I can only respond to text messages. Please send a text command.`);
    }
  }
};

export { poll };
