import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:greeting_text');

// Define your channel ID (e.g., "@eduhub2025" or a numeric ID)
const CHANNEL_ID = '@eduhub2025';

// Helper function to find and forward messages
const findAndForwardMessage = async (ctx: Context, keyword: string) => {
  try {
    // Fetch messages from the channel
    const messages = await ctx.telegram.getChat(CHANNEL_ID);

    // Find a message containing the keyword
    const matchingMessage = messages.messages?.find((msg) => 
      'text' in msg && msg.text.toLowerCase().includes(keyword)
    );

    if (matchingMessage) {
      // Forward the found message to the user
      await ctx.telegram.forwardMessage(
        ctx.chat?.id!, // User's chat ID
        CHANNEL_ID, // From the channel
        matchingMessage.message_id // Message ID to forward
      );
    } else {
      await ctx.reply(`Sorry, I couldn't find any message containing the keyword "${keyword}".`);
    }
  } catch (error) {
    debug('Error in findAndForwardMessage:', error);
    await ctx.reply('An error occurred while searching for messages. Please try again later.');
  }
};

// Main function to handle commands
const greeting = () => async (ctx: Context) => {
  debug('Triggered "greeting" command');
  
  const messageId = ctx.message?.message_id;
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (messageId && userMessage) {
    // Extract keywords to search in the channel
    const keywords = userMessage.split(' ').slice(1).join(' '); // Assuming "/command keyword"
    
    if (userMessage.startsWith('/syllabus')) {
      await findAndForwardMessage(ctx, keywords || 'syllabus');
    } else {
      await ctx.reply('Invalid command. Please use a valid keyword.');
    }
  } else {
    await ctx.reply('I can only respond to text commands. Please send a valid message.');
  }
};

export { greeting };
