// src/advanced/forwardMessage.ts
import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:forwardMessage');

// Forwarding function
const forwardMessage = () => async (ctx: Context) => {
  debug('Triggered "forwardMessage" command');

  // Check if ctx.chat exists before using it
  const chatId = ctx.chat?.id;
  if (!chatId) {
    debug('Chat is undefined or unavailable.');
    return;
  }

  const messageId = ctx.message?.message_id;
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (messageId) {
    if (userMessage && userMessage.includes('syllabus')) {
      // Channel and message ID for the syllabus
      const channelId = '@eduhub2025';
      const messageIdToForward = 3; // Message ID to forward

      // Forward the syllabus message to the user
      await ctx.telegram.forwardMessage(chatId, channelId, messageIdToForward);
    }
    // If the message doesn't contain the known keywords (like "syllabus"), do nothing (silence)
  }
};

export { forwardMessage };
