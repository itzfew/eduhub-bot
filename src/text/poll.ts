import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:poll');

// Sample random biology polls
const biologyPolls = [
  { question: "What is the powerhouse of the cell?", options: ["Mitochondria", "Nucleus", "Chloroplast", "Endoplasmic Reticulum"] },
  { question: "Which vitamin is produced when the skin is exposed to sunlight?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"] },
  { question: "What is the genetic material in all living organisms?", options: ["DNA", "RNA", "Proteins", "Carbohydrates"] },
  // Add more biology-related questions here...
];

// Sample random physics polls
const physicsPolls = [
  { question: "What is the unit of force?", options: ["Newton", "Joule", "Watt", "Pascal"] },
  { question: "What is the speed of light?", options: ["3 × 10^8 m/s", "2 × 10^8 m/s", "1 × 10^8 m/s", "5 × 10^8 m/s"] },
  { question: "Who developed the theory of relativity?", options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"] },
  // Add more physics-related questions here...
];

// Main poll function
const poll = () => async (ctx: Context) => {
  debug('Triggered "poll" command');

  const messageId = ctx.message?.message_id;
  const userName = `${ctx.message?.from.first_name}`;

  // Get the message text or handle non-text messages
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (messageId) {
    if (userMessage) {
      // Process text messages only
      if (userMessage.startsWith('/startpoll')) {
        const parts = userMessage.split(' ');
        const subject = parts[1]?.toLowerCase();

        if (subject === 'biology') {
          await sendPolls(ctx, biologyPolls);
        } else if (subject === 'physics') {
          await sendPolls(ctx, physicsPolls);
        } else {
          await ctx.reply(`Sorry, I don't have polls for ${subject}. Try typing /startpoll biology or /startpoll physics.`);
        }
      } else if (userMessage.includes('poll')) {
        await ctx.reply(`Hey ${userName}, I can help you create a poll. Type /startpoll followed by a subject (e.g., /startpoll biology).`);
      }
    } else {
      // Handle non-text messages (e.g., media)
      await ctx.reply(`I can only respond to text messages. Please send a text command.`);
    }
  }
};

// Function to send 10 random polls with a 30-second interval
const sendPolls = async (ctx: Context, polls: { question: string, options: string[] }[]) => {
  const chatId = ctx.chat?.id;

  if (chatId !== undefined) {
    let pollCount = 0;

    const interval = setInterval(async () => {
      if (pollCount >= 10) {
        clearInterval(interval); // Stop after 10 polls
        await ctx.reply('You have completed all polls!');
      } else {
        const randomPoll = polls[Math.floor(Math.random() * polls.length)];
        try {
          // Send the poll to the user
          await ctx.telegram.sendPoll(chatId, randomPoll.question, randomPoll.options, {
            is_anonymous: true,
            allows_multiple_answers: false,
          });
          pollCount++;
        } catch (error) {
          debug('Error sending poll:', error);
          await ctx.reply('Something went wrong while sending the poll.');
        }
      }
    }, 30000); // Send a poll every 30 seconds
  } else {
    await ctx.reply('Chat ID is not valid. Please try again later.');
  }
};

export { poll };
