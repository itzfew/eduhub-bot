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
    // Mapping of resource names to message IDs
    const resourceMap: { [key: string]: number } = {
      'med easy physics': 5,       // Med Easy Physics
      'akash test series 2024': 1, // Akash Test Series 2024
      'akash modules 2024': 2,     // Akash Modules 2024
      'allen modules': 3,          // Allen Modules
      'allen test 2024': 4,        // Allen Test 2024
      'botany med easy': 6,        // Botany Med Easy
      'zoology med easy': 7,       // Zoology Med Easy
      'chemistry know your ncert': 8, // Chemistry - Know Your NCERT
      'physics know your ncert': 9, // Physics - Know Your NCERT
      'biology punch': 10,         // Biology Punch
      'chemistry punch': 11,       // Chemistry Punch
      'physics punch': 12,         // Physics Punch
      'biohack 4th edition': 13,   // Biohack 4th Edition by Parth Goyal
      'neet 11 years chapterwise pyq': 14, // NEET 11 Years Chapterwise PYQ
      'nta neet speed test': 15,   // NTA NEET Speed Test
      'ncert diagrams all-in-one': 16 // NCERT Diagrams All-in-One
    };

    // Check if user message matches any of the keys in resourceMap
    const resourceMatch = Object.keys(resourceMap).find(key => userMessage.includes(key));

    if (resourceMatch) {
      const messageIdToForward = resourceMap[resourceMatch];
      const channelId = '@eduhub2025'; // Channel ID

      // Forward the message corresponding to the resource
      await ctx.telegram.forwardMessage(chatId, channelId, messageIdToForward);
    }
  }
};

export { forwardMessage };
