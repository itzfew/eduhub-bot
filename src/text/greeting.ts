import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:greeting_text');

// Main greeting function
const greeting = () => async (ctx: Context) => {
  debug('Triggered "greeting" text command');

  const messageId = ctx.message?.message_id;
  const userName = `${ctx.message?.from.first_name}`;

  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (messageId) {
    if (userMessage) {
      if (userMessage === '/start') {
        await ctx.reply(`Hey ${userName}, how may I help you?`);
      } else if (userMessage.includes('syllabus')) {
        // Replace this with predefined message ID or saved message
        const channelId = '@eduhub2025'; 
        const messageIdToForward = 123456789; // Replace with actual message ID that you want to forward
        await ctx.telegram.forwardMessage(ctx.chat.id, channelId, messageIdToForward);
        await ctx.reply(`Here is the syllabus information from the Eduhub channel:`);
      }
    } else {
      await ctx.reply(`I can only respond to text messages. Please send a text command.`);
    }
  }
};

export { greeting };
