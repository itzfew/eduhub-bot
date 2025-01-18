import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:pdf');

// Function to send the file based on keyword search
const sendFile = (ctx: Context, keyword: string) => {
  debug('Triggered "sendFile" with keyword:', keyword);

  // Assume the file is stored or fetched based on the keyword
  // For this example, let's simulate a file search
  const files = [
    { keyword: 'neet', fileId: 'fileId1', caption: 'NEET Study Material' },
    { keyword: 'jee', fileId: 'fileId2', caption: 'JEE Study Material' },
  ];

  const file = files.find((file) => file.keyword.toLowerCase() === keyword.toLowerCase());

  if (file) {
    ctx.replyWithDocument(file.fileId, { caption: file.caption });
  } else {
    ctx.reply(`No file found for the keyword "${keyword}".`);
  }
};

// Main function to handle PDF requests
const pdf = () => async (ctx: Context) => {
  const userMessage = ctx.message?.text?.toLowerCase();

  if (userMessage) {
    if (userMessage.includes('neet')) {
      // Trigger the sendFile function with the 'neet' keyword
      await sendFile(ctx, 'neet');
    } else if (userMessage.includes('jee')) {
      // Trigger the sendFile function with the 'jee' keyword
      await sendFile(ctx, 'jee');
    } else {
      await ctx.reply('Please provide a valid keyword to search for files (e.g., "neet", "jee").');
    }
  } else {
    await ctx.reply('Please send a text message with the keyword to search for files.');
  }
};

export { pdf };
