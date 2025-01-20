import { Telegraf, Context } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the bot with your token
const bot = new Telegraf(process.env.BOT_TOKEN as string);

// Function to get recent messages from the channel
async function fetchChannelMessages() {
  try {
    // Fetch the last 10 messages from the channel (you can adjust the limit)
    const messages = await bot.telegram.getChatHistory('@eduhub2025', {
      limit: 10, // Number of messages to fetch, you can increase if necessary
    });

    return messages;
  } catch (error) {
    console.error('Error fetching channel messages:', error);
    return [];
  }
}

// Function to handle incoming messages from the user
async function handleMessage(ctx: Context) {
  try {
    const userMessage = ctx.message?.text?.toLowerCase();

    // If no message or invalid input, exit the function
    if (!userMessage) return;

    // Fetch recent messages from the channel
    const messages = await fetchChannelMessages();

    // Check if the user's message contains specific keywords
    if (userMessage.includes('syllabus') || userMessage.includes('greeting')) {
      // Search for a matching message in the channel messages
      const matchingMessage = messages.find(msg =>
        msg.text && msg.text.toLowerCase().includes(userMessage)
      );

      // If a matching message is found, forward it to the user
      if (matchingMessage) {
        await ctx.reply(`Found a message: ${matchingMessage.text}`);
      } else {
        await ctx.reply('No matching message found in the channel.');
      }
    } else {
      // If no keywords are matched, send a generic reply
      await ctx.reply(`You said: ${userMessage}`);
    }
  } catch (error) {
    console.error('Error processing message:', error);
    await ctx.reply('Sorry, there was an issue processing your request.');
  }
}

// Set up the bot to listen for incoming messages
bot.on('text', handleMessage);

// Start the bot
bot.launch().catch((error) => {
  console.error('Error launching bot:', error);
});

