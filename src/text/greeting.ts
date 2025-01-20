import { Context } from 'telegraf';
import createDebug from 'debug';

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
        await ctx.reply(`Hey ${userName}, how may I help you?`);
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
8. /cal - calculator
9. /exam - Access exam resources`);
      } else if (userMessage.includes('syllabus')) {
        // Forward the message with the keyword 'syllabus' from the channel
        const channelId = '@eduhub2025'; // Replace with your channel ID
        const keyword = 'syllabus'; // The keyword you're searching for
        try {
          const messages = await ctx.telegram.getChatHistory(channelId, { limit: 100 }); // Get the last 100 messages from the channel
          const relevantMessage = messages.find((msg: any) => msg.text && msg.text.toLowerCase().includes(keyword));
          
          if (relevantMessage) {
            await ctx.telegram.forwardMessage(ctx.chat.id, channelId, relevantMessage.message_id);
            await ctx.reply(`Here is the syllabus information from the Eduhub channel:`);
          } else {
            await ctx.reply(`Sorry ${userName}, I couldn't find any syllabus-related messages.`);
          }
        } catch (error) {
          console.error('Error fetching messages from channel:', error);
          await ctx.reply(`Sorry ${userName}, I couldn't retrieve the syllabus message at this moment.`);
        }
      }
      // Removed the "I don't understand" response
    } else {
      // Handle non-text messages (e.g., media)
      await ctx.reply(`I can only respond to text messages. Please send a text command.`);
    }
  }
};

export { greeting };
