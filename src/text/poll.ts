import { Context } from 'telegraf';
import createDebug from 'debug';
import axios from 'axios';

const debug = createDebug('bot:poll');

// Fetch questions from the GitHub URL
const fetchQuestions = async () => {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/itzfew/eduhub-bot/refs/heads/master/questions.json');
    return response.data; // Return the parsed JSON data
  } catch (error) {
    debug('Error fetching questions:', error);
    throw new Error('Failed to fetch questions.');
  }
};

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
        // Parse the command to extract the subject and number of questions
        const [command, subject, numQuestions] = userMessage.split(' ');

        if (subject && numQuestions) {
          // Send specified number of questions
          const numberOfQuestions = parseInt(numQuestions, 10);
          await sendRandomQuiz(ctx, subject, numberOfQuestions);
        } else {
          // Send 1 random quiz by default
          await sendRandomQuiz(ctx);
        }
      } else if (userMessage.includes('poll')) {
        await ctx.reply(`Hey ${userName}, I can help you create a quiz. Type /startpoll <subject> <number> to get random quizzes from biology or physics.`);
      }
    } else {
      // Handle non-text messages (e.g., media)
      await ctx.reply(`I can only respond to text messages. Please send a text command.`);
    }
  }
};

// Function to send random quiz questions
const sendRandomQuiz = async (ctx: Context, subject: string = '', numQuestions: number = 1) => {
  const chatId = ctx.chat?.id;

  if (chatId !== undefined) {
    try {
      // Fetch questions
      const questionsData = await fetchQuestions();
      const subjectData = questionsData[subject.toLowerCase()]; // Get the subject data (biology or physics)

      if (!subjectData) {
        await ctx.reply('Invalid subject. Please try "biology" or "physics".');
        return;
      }

      // Select random questions based on the user's requested number
      const randomQuestions = [];
      for (let i = 0; i < numQuestions; i++) {
        const randomQuiz = subjectData[Math.floor(Math.random() * subjectData.length)];
        randomQuestions.push(randomQuiz);
      }

      // Send the selected quizzes to the user
      for (const randomQuiz of randomQuestions) {
        await ctx.telegram.sendQuiz(chatId, randomQuiz.question, randomQuiz.options, {
          correct_option_id: randomQuiz.correctAnswer,
          is_anonymous: false, // Not anonymous to track the answers
          allows_multiple_answers: false,
        });
      }
    } catch (error) {
      debug('Error sending quiz:', error);
      await ctx.reply('Something went wrong while sending the quiz.');
    }
  } else {
    await ctx.reply('Chat ID is not valid. Please try again later.');
  }
};

export { poll };
