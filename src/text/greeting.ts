import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:greeting_text');

// Main greeting function
const greeting = () => async (ctx: Context) => {
  debug('Triggered "greeting" text command');

  // Check if ctx.chat exists before using it
  const chatId = ctx.chat?.id;
  if (!chatId) {
    debug('Chat is undefined or unavailable.');
    return;
  }

  const messageId = ctx.message?.message_id;
  const userName = `${ctx.message?.from.first_name}`;

  // Ensure message exists and check for text type
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (messageId) {
    if (userMessage) {
      if (userMessage === '/start') {
        await ctx.reply(`Hey ${userName}, how may I help you?`);
      } else if (userMessage.includes('syllabus')) {
        // Channel and message ID for the syllabus
        const channelId = '@eduhub2025';
        const messageIdToForward = 3; // Message ID to forward

        // Forward the syllabus message to the user
        await ctx.telegram.forwardMessage(chatId, channelId, messageIdToForward);
        await ctx.reply(`Here is the syllabus information from the Eduhub channel.`);
      }
    } else {
      await ctx.reply(`I can only respond to text messages. Please send a text command.`);
    }
  }
};

export { greeting };
