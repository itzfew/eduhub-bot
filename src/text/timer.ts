import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:timer');

// Main timer function
const timer = () => async (ctx: Context) => {
  debug('Triggered "timer" command');

  const messageId = ctx.message?.message_id;
  const userName = `${ctx.message?.from.first_name}`;
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (messageId && userMessage) {
    if (userMessage === '/timer') {
      let timerDuration = 10; // Set the timer duration (in seconds)
      await ctx.reply(`Hi ${userName}, the timer is starting! You will receive a message every second.`);

      const intervalId = setInterval(async () => {
        if (timerDuration > 0) {
          await ctx.reply(`Timer: ${timerDuration} seconds remaining.`);
          timerDuration--;
        } else {
          clearInterval(intervalId);
          await ctx.reply(`Timer ended, ${userName}!`);
        }
      }, 1000); // Send a message every 1 second
    } else if (userMessage.includes('/list') || userMessage.includes('/command') || userMessage.includes('/commands')) {
      await ctx.reply(`Eduhub Available Commands:

1. /help - Get information about bot commands
2. /about - Learn more about this bot
3. /groups - Get a list of study groups
4. /neet - Access resources for NEET
5. /jee - Access resources for JEE
6. /study - Get study materials for various subjects
7. /pyq - View previous year's questions
8. /cal - calculator
9. /exam - Access exam resources`);
    } else {
      // Handle unknown or non-timer commands
      await ctx.reply(`I can only respond to commands like /timer. Type /list for available commands.`);
    }
  }
};

export { timer };
