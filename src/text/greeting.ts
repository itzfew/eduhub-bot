 import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:greeting_text');

// Helper function for generating random greetings
const getRandomGreeting = (userName: string) => {
  const greetings = [
    `Hey ${userName}, how may I help you?`,
    `Hello ${userName}, what can I assist you with today?`,
    `Hi ${userName}, need any help?`,
    `Hey there ${userName}, how can I be of assistance?`,
    `Hello ${userName}, is there something you'd like to know?`
  ];

  // Return a random greeting
  return greetings[Math.floor(Math.random() * greetings.length)];
};

// Helper function for formatting the date to dd/mm/yyyy
const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

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
        // Send random greeting, list of commands, and current date
        const greetingMessage = getRandomGreeting(userName);
        const currentDate = formatDate(new Date()); // Use the formatted date
        await ctx.reply(`${greetingMessage}\n\nEduhub Available Commands:

/neet - Access resources for NEET
/jee - Access resources for JEE
/study - Get study materials for various subjects
/pyq or /exam - View previous year's questions
/help - Get help
/about - Learn more about this bot
/groups - Get a list of study groups
/cal - Use the calculator
/list - View more commands

Today's date is: ${currentDate}`);
      } else if (userMessage.includes('hi') || userMessage.includes('hello') || userMessage.includes('hey') || userMessage.includes('hlo')) {
        await ctx.reply(getRandomGreeting(userName));
      } else if (userMessage.includes('bye') || userMessage.includes('goodbye') || userMessage.includes('exit')) {
        await ctx.reply(`Goodbye ${userName}, take care!`);
      } else if (userMessage.includes('thank') || userMessage.includes('thanks')) {
        await ctx.reply(`You're welcome, ${userName}! Let me know if you need further assistance.`);
      } else if (userMessage.includes('how are you') || userMessage.includes('how are you doing')) {
        await ctx.reply(`I'm doing great, ${userName}! How can I assist you today?`);
      } else if (userMessage.includes('date')) {
        const currentDate = formatDate(new Date()); // Use the formatted date
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
8. /cal - calculator
9. /exam - Access exam resources`);
      }
    } else {
      // Handle non-text messages (e.g., media)
      await ctx.reply(`I can only respond to text messages. Please send a text command.`);
    }
  }
};

export { greeting };
