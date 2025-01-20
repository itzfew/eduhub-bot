import { Telegraf, Context } from 'telegraf';
import dotenv from 'dotenv';
import createDebug from 'debug';

dotenv.config();

const debug = createDebug('bot:greeting_text');

// Initialize bot
const bot = new Telegraf(process.env.BOT_TOKEN as string);

// Store messages for search
const channelMessages: string[] = [];

// Listen for new channel posts and store them
bot.on('channel_post', (ctx) => {
  const text = ctx.channelPost?.text;
  if (text) {
    channelMessages.push(text);
    debug(`Stored message: "${text}"`);
  }
});

// Command to search and forward messages
bot.command('syllabus', async (ctx: Context) => {
  const keyword = ctx.message?.text?.split(' ').slice(1).join(' ');
  if (!keyword) {
    return ctx.reply('Please provide a keyword to search for.');
  }

  debug(`Searching for keyword: "${keyword}"`);
  const foundMessage = channelMessages.find((msg) =>
    msg.toLowerCase().includes(keyword.toLowerCase())
  );

  if (foundMessage) {
    await ctx.reply(foundMessage);
  } else {
    await ctx.reply(`No message found containing the keyword: "${keyword}"`);
  }
});

// Launch the bot
bot.launch().then(() => {
  console.log('Bot is running!');
});
