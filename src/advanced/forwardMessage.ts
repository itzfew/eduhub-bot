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

  if (messageId && userMessage) {
    // Mapping of resource names to message ID ranges
    const resourceMap: { [key: string]: number[] } = {
      'med easy physics': [1],         // Med Easy Physics (Message ID 1)
      'akash test series 2024': [2, 3], // Akash Test Series 2024 (Message IDs 2, 3)
      'akash modules 2024': [4],       // Akash Modules 2024 (Message ID 4)
      'allen modules': [5],            // Allen Modules (Message ID 5)
      'allen test 2024': [6],          // Allen Test 2024 (Message ID 6)
      'botany med easy': [7],          // Botany Med Easy (Message ID 7)
      'zoology med easy': [1,2,3,4,5,6,7,8],         // Zoology Med Easy (Message ID 8)
      'chemistry know your ncert': [9], // Chemistry - Know Your NCERT (Message ID 9)
      'physics know your ncert': [10], // Physics - Know Your NCERT (Message ID 10)
      'biology punch': [11],           // Biology Punch (Message ID 11)
      'chemistry punch': [12],         // Chemistry Punch (Message ID 12)
      'physics punch': [13],           // Physics Punch (Message ID 13)
      'biohack 4th edition': [14],     // Biohack 4th Edition by Parth Goyal (Message ID 14)
      'neet 11 years chapterwise pyq': [15], // NEET 11 Years Chapterwise PYQ (Message ID 15)
      'nta neet speed test': [16],     // NTA NEET Speed Test (Message ID 16)
      'ncert diagrams all-in-one': [17] // NCERT Diagrams All-in-One (Message ID 17)
    };

    // Check if user message matches any of the keys in resourceMap (using partial match)
    const resourceMatch = Object.keys(resourceMap).find(key => {
      return userMessage && userMessage.includes(key.toLowerCase());
    });

    if (resourceMatch) {
      const messageIdsToForward = resourceMap[resourceMatch];  // Get the array of message IDs
      const channelId = '@eduhub2025'; // Channel ID

      // Forward each message in the range associated with the resource
      for (const messageIdToForward of messageIdsToForward) {
        debug(`Attempting to forward message ID: ${messageIdToForward} for resource: ${resourceMatch}`);
        
        try {
          // Forward the message from the channel to the chat
          await ctx.telegram.forwardMessage(chatId, channelId, messageIdToForward);
          debug(`Successfully forwarded message ID: ${messageIdToForward}`);
        } catch (error) {
          debug(`Failed to forward message ID: ${messageIdToForward} due to error: ${error}`);
        }
      }
    }
  }
};

export { forwardMessage };
