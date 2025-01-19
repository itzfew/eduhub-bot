// location.ts
import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:location');

// Main location function
const location = () => async (ctx: Context) => {
  debug('Triggered "location" function');

  const messageId = ctx.message?.message_id;
  const userName = `${ctx.message?.from.first_name}`;

  // Get the message text or handle non-text messages
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (messageId && userMessage) {
    // Check if the message contains the word "location"
    if (userMessage.includes('location')) {
      // Check if the user has shared their location
      if (ctx.message.location) {
        const { latitude, longitude } = ctx.message.location;
        await ctx.reply(`Your current location is: Latitude: ${latitude}, Longitude: ${longitude}`);
      } else {
        await ctx.reply('Please share your location so I can retrieve it.');
      }
    }
  } else {
    // Handle non-text messages (e.g., media)
    // If the message is not text, do nothing (no reply)
  }
};

export { location };
