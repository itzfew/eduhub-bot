import { Context } from 'telegraf';
import createDebug from 'debug';
import { Markup } from 'telegraf';  // Importing Markup for creating buttons

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
        // Sending a menu when /start is triggered
        await ctx.reply(`Hey ${userName}, how may I help you? Choose an option below:`, 
          Markup.inlineKeyboard([
            Markup.button.callback('PyQs', 'pyqs'),
            Markup.button.callback('Study Material', 'study_material'),
            Markup.button.callback('Commands', 'commands'),
            Markup.button.callback('About', 'about'),
            Markup.button.callback('Help', 'help')
          ]).extra()
        );
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

1. /help - Get information about bot commands
2. /about - Learn more about this bot
3. /groups - Get a list of study groups
4. /neet - Access resources for NEET
5. /jee - Access resources for JEE
6. /study - Get study materials for various subjects
7. /pyq - View previous year's questions
8. /cal - Calculator
9. /exam - Access exam resources`);
      }
    } else {
      // Handle non-text messages (e.g., media)
      await ctx.reply(`I can only respond to text messages. Please send a text command.`);
    }
  }
};

// Handle the callback from the inline buttons
const handleCallback = () => async (ctx: Context) => {
  const callbackData = ctx.callbackQuery?.data;

  if (callbackData) {
    switch (callbackData) {
      case 'pyqs':
        await ctx.reply(`Please select the following command (e.g., /pyq or /exam) for NEET and JEE PyQs.`);
        break;
      case 'study_material':
        await ctx.reply('To access study materials, use the /study command.');
        break;
      case 'commands':
        await ctx.reply('Here are the available commands: /about, /help, /study, /neet, /jee');
        break;
      case 'about':
        await ctx.reply('This bot helps you with NEET, JEE, and other study materials. It also provides quick access to previous years’ questions, calculators, and more.');
        break;
      case 'help':
        await ctx.reply('Here is the help section. You can use these commands: /about, /help, /study, /pyq, /exam.');
        break;
      default:
        await ctx.reply(`Sorry, I don't recognize this option.`);
    }

    // Acknowledge the callback to remove the button (optional)
    await ctx.answerCbQuery();
  }
};

export { greeting, handleCallback };
