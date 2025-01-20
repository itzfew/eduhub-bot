i.mport { Context } from 'telegraf';
import createDebug from 'debug';
import { study } from '../commands/study';
import { about } from '../commands/about';
import { help } from '../commands/help';
import { list } from '../commands/list';

const debug = createDebug('bot:greeting_text');

// Main greeting function
const greeting = () => async (ctx: Context) => {
  debug('Triggered "greeting" text command');

  const messageId = ctx.message?.message_id;
  const userName = `${ctx.message?.from.first_name}`;

  // Get the message text or handle non-text messages
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (messageId) {
    if (userMessage) {
      // Process text messages only
      if (userMessage === '/start') {
        // Main menu options
        await ctx.reply(`
Hey ${userName}, how may I assist you today? Choose an option below:

- /1 Previous Year's Questions (PyQs)
- /2 Study Materials for various subjects
- /3 Commands to learn more about available options
- /4 About this bot and its features
- /5 Help if you need assistance or have questions
        `);
      } else if (userMessage === '/1') {
        await ctx.reply(`You selected **Previous Year's Questions (PyQs)**. Please select the following command:

- /pyq 
OR
- /exam for NEET and JEE PyQs`);
      } else if (userMessage === '/2') {
        // Dispatch the study command from the src/commands/study.ts
        study(ctx);
      } else if (userMessage === '/3') {
        // Dispatch the list of available commands from src/commands/list.ts
        list(ctx);
      } else if (userMessage === '/4') {
        // Dispatch the about command from src/commands/about.ts
        about(ctx);
      } else if (userMessage === '/5') {
        // Dispatch the help command from src/commands/help.ts
        help(ctx);
      } else if (userMessage.includes('hi') || userMessage.includes('hello') || userMessage.includes('hey') || userMessage.includes('hlo')) {
        await ctx.reply(`Hey ${userName}, how may I help you?`);
      } else if (userMessage.includes('bye') || userMessage.includes('goodbye') || userMessage.includes('exit')) {
        await ctx.reply(`Goodbye ${userName}, take care!`);
      } else if (userMessage.includes('thank') || userMessage.includes('thanks')) {
        await ctx.reply(`You're welcome, ${userName}! Let me know if you need further assistance.`);
      } else if (userMessage.includes('how are you') || userMessage.includes('how are you doing')) {
        await ctx.reply(`I'm doing great, ${userName}! How can I assist you today?`);
      } else if (userMessage.includes('date')) {
        const currentDate = new Date().toLocaleDateString();
        await ctx.reply(`Today's date is: ${currentDate}`);
      } else if (userMessage.includes('/list') || userMessage.includes('/command') || userMessage.includes('/commands')) {
        await ctx.reply(`Eduhub Available Commands:

- /help - Get information about bot commands
- /about - Learn more about this bot
- /groups - Get a list of study groups
- /neet - Access resources for NEET
- /jee - Access resources for JEE
- /study - Get study materials for various subjects
- /pyq - View previous year's questions
- /cal - Calculator
- /exam - Access exam resources`);
      }
    } else {
      // Handle non-text messages (e.g., media)
      await ctx.reply(`I can only respond to text messages. Please send a text command.`);
    }
  }
};

export { greeting };
