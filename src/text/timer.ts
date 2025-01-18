import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:timer');

// Main timer function
const timer = () => async (ctx: Context) => {
  debug('Triggered "timer" command');

  const userName = `${ctx.message?.from.first_name}`;
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (userMessage && userMessage === '/timer') {
    let timerDuration = 10; // Set the timer duration (in seconds)

    // Send initial message
    await ctx.reply(`Hi ${userName}, the timer is starting! You will receive a message every second.`);

    // Set interval to send a message every second
    const intervalId = setInterval(async () => {
      if (timerDuration > 0) {
        await ctx.reply(`Timer: ${timerDuration} seconds remaining.`);
        timerDuration--;
      } else {
        clearInterval(intervalId); // Clear the interval once the timer is finished
        await ctx.reply(`Timer ended, ${userName}!`);
      }
    }, 1000); // Send a message every 1 second
  } else {
    await ctx.reply(`Please type /timer to start the timer.`);
  }
};

export { timer };
