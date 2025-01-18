import { Context } from 'telegraf';
import createDebug from 'debug';
import { Markup } from 'telegraf';
import { Telegram } from 'telegraf/typings/core/types/typegram';

const debug = createDebug('bot:pdf');

// Function to fetch and send file based on search keyword
const sendFile = (channelId: string, keyword: string) => async (ctx: Context) => {
  debug('Triggered "sendFile" with keyword:', keyword);

  try {
    // Fetch messages from the channel using Telegram API
    const messages = await ctx.telegram.getChatMessages(channelId, {
      limit: 50, // Limit to the latest 50 messages
    });

    // Find the message with the file and matching caption
    const fileMessage = messages.find((message) =>
      message.caption && message.caption.toLowerCase().includes(keyword.toLowerCase())
    );

    if (fileMessage) {
      // Send the file to the user
      const fileId = fileMessage.document.file_id;
      await ctx.replyWithDocument(fileId, { caption: `Here is your requested file: ${fileMessage.caption}` });
    } else {
      // If no file with the keyword is found
      await ctx.reply(`Sorry, no file found for the keyword "${keyword}"`);
    }
  } catch (error) {
    debug('Error fetching messages:', error);
    await ctx.reply('There was an error retrieving the file. Please try again later.');
  }
};

// Main function for handling commands
const handlePdfRequest = () => async (ctx: Context) => {
  const userMessage = ctx.message?.text?.toLowerCase();

  if (userMessage) {
    if (userMessage.includes('neet')) {
      // Trigger the sendFile function with the 'neet' keyword
      await sendFile('@neetpw01', 'neet')(ctx);
    } else {
      await ctx.reply('Please provide a valid keyword to search for files (e.g., "neet").');
    }
  } else {
    await ctx.reply('Please send a text message with the keyword to search for files.');
  }
};

export { handlePdfRequest };
