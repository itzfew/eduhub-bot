import { Context } from 'telegraf';
import createDebug from 'debug';
import fs from 'fs';

const debug = createDebug('bot:poll');

// Read the questions from the JSON file
const questionsData = JSON.parse(fs.readFileSync('questions.json', 'utf8'));

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
        // Send 1 random quiz from any subject (biology or physics)
        await sendRandomQuiz(ctx);
      } else if (userMessage.includes('poll')) {
        await ctx.reply(`Hey ${userName}, I can help you create a quiz. Type /startpoll to get a random quiz from biology or physics.`);
      }
    } else {
      // Handle non-text messages (e.g., media)
      await ctx.reply(`I can only respond to text messages. Please send a text command.`);
    }
  }
};

// Function to send a random quiz from either biology or physics
const sendRandomQuiz = async (ctx: Context) => {
  const chatId = ctx.chat?.id;

  if (chatId !== undefined) {
    // Combine both biology and physics quizzes into one array
    const allQuizzes = [...questionsData.biology, ...questionsData.physics];
    
    // Select a random quiz
    const randomQuiz = allQuizzes[Math.floor(Math.random() * allQuizzes.length)];
    
    try {
      // Send the quiz to the user
      await ctx.telegram.sendQuiz(chatId, randomQuiz.question, randomQuiz.options, {
        correct_option_id: randomQuiz.correctAnswer,
        is_anonymous: false, // Not anonymous to track the answers
        allows_multiple_answers: false,
      });
    } catch (error) {
      debug('Error sending quiz:', error);
      await ctx.reply('Something went wrong while sending the quiz.');
    }
  } else {
    await ctx.reply('Chat ID is not valid. Please try again later.');
  }
};

export { poll };
