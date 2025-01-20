// src/advanced/forwardMessage.ts
import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:forwardMessage');

// Example dynamic content mapping (this could be a database or configuration in production)
const keywordMappings = {
  'syllabus': { channelId: '@eduhub2025', messageId: 3 },
  'schedule': { channelId: '@eduhub2025', messageId: 5 },
  // Add more dynamic mappings as required
};

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

  if (messageId && userMessage) {
    try {
      // Iterate over all keyword mappings to find matches
      for (const keyword in keywordMappings) {
        if (userMessage.includes(keyword)) {
          const { channelId, messageId: messageToForward } = keywordMappings[keyword];

          debug(`Forwarding message with keyword "${keyword}"...`);
          await ctx.telegram.forwardMessage(chatId, channelId, messageToForward);
          debug(`Message forwarded successfully for "${keyword}".`);
          return; // Exit once a match is found and message is forwarded
        }
      }

      debug('No relevant keyword found in the message.');
    } catch (error) {
      debug('Error while forwarding message:', error);
      // Log or handle error as needed
    }
  } else {
    debug('No valid message or message content found.');
  }
};

export { forwardMessage };
