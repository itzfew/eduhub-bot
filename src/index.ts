import { Telegraf } from 'telegraf';
import { about } from './commands';
import { help } from './commands';
import { study } from './commands/study';
import { neet } from './commands/neet';
import { jee } from './commands/jee';
import { quizes } from './commands/quizes';
import { groups } from './commands/groups';
import { list } from './commands/list';

import { greeting, handleCallback } from './text';  // Importing greeting and handleCallback

import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);

// Command registrations
bot.command('about', about());
bot.command('help', help());
bot.command('study', study());
bot.command('neet', neet());
bot.command('jee', jee());
bot.command('quizes', quizes());
bot.command('groups', groups());
bot.command('list', list());

// Register the poll command
bot.command('poll', poll());

// Message handling (including greeting, funInteraction, calculator, pyq, and forwardMessage handlers)
bot.on('message', async (ctx) => {
  // Call the greeting handler
  await greeting()(ctx);
});

// Handle callback queries (button clicks)
bot.on('callback_query', handleCallback());

// Production mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};

// Development mode
if (ENVIRONMENT !== 'production') {
  development(bot);
}
