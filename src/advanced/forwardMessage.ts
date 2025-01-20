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
    try {
      if (userMessage) {
        if (userMessage.includes('syllabus')) {
          // Channel and message ID for the syllabus
          const channelId = '@eduhub2025';
          const messageIdToForward = 3; // Message ID to forward

          debug('Forwarding syllabus message to user...');
          await ctx.telegram.forwardMessage(chatId, channelId, messageIdToForward);
          debug('Syllabus forwarded successfully.');
        }
        // You can add more conditions here for other keywords
        else if (userMessage.includes('schedule')) {
          const channelId = '@eduhub2025';
          const messageIdToForward = 5; // Message ID for schedule

          debug('Forwarding schedule message to user...');
          await ctx.telegram.forwardMessage(chatId, channelId, messageIdToForward);
          debug('Schedule forwarded successfully.');
        }
        // If the message doesn't contain any known keyword, do nothing (silence)
        else {
          debug('No relevant keyword found in the message.');
        }
      }
    } catch (error) {
      debug('Error while forwarding message:', error);
      // Log or handle error as needed
    }
  } else {
    debug('No message ID found.');
  }
};

export { forwardMessage };
