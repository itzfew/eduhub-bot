import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:greeting');

// Channel ID where the bot is an admin
const CHANNEL_ID = '@eduhub2025'; // Replace with your channel username or numeric ID

// Main greeting and message forward function
const greeting = () => async (ctx: Context) => {
  debug('Triggered "greeting" with keyword-based forwarding');

  const messageId = ctx.message?.message_id;
  const userName = `${ctx.message?.from.first_name}`;
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (messageId && userMessage) {
    try {
      // Check if the user has provided a keyword to search
      const keyword = userMessage.trim();
      if (keyword) {
        debug(`Searching for keyword: "${keyword}" in channel: ${CHANNEL_ID}`);

        // Fetch the recent messages from the channel
        const messages = await fetchRecentMessages(ctx, CHANNEL_ID);

        // Find the first message that contains the keyword
        const matchingMessage = messages.find((msg) => msg.text && msg.text.toLowerCase().includes(keyword));

        if (matchingMessage) {
          // Forward the matching message to the user
          await ctx.telegram.forwardMessage(ctx.chat.id, CHANNEL_ID, matchingMessage.message_id);
        } else {
          // Inform the user if no relevant message is found
          await ctx.reply(`Sorry ${userName}, I couldn't find any message containing "${keyword}" in the channel.`);
        }
      } else {
        // Handle empty or invalid input
        await ctx.reply(`Hi ${userName}, please provide a valid keyword to search for messages in the channel.`);
      }
    } catch (error) {
      debug(`Error occurred: ${error.message}`);
      await ctx.reply(`Oops! Something went wrong. Please try again later.`);
    }
  } else {
    // Handle non-text messages
    await ctx.reply(`I can only process text messages. Please send a valid keyword to search.`);
  }
};

// Function to fetch recent messages from the channel
const fetchRecentMessages = async (ctx: Context, channelId: string) => {
  const limit = 50; // Number of messages to fetch (adjust as needed)
  const messages = [];

  try {
    const response = await ctx.telegram.getChat(channelId);
    debug(`Fetched chat info: ${JSON.stringify(response)}`);

    for (let offset = 0; offset < limit; offset += 1) {
      const batch = await ctx.telegram.getChatHistory(channelId, {
        offset: -offset,
        limit: 1,
      });
      if (batch.length) {
        messages.push(...batch);
      } else {
        break; // Stop if no more messages are available
      }
    }
  } catch (error) {
    debug(`Error fetching messages: ${error.message}`);
  }

  return messages;
};

export { greeting };
