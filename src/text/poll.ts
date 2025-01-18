import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:poll');

// Sample random biology quizzes
const biologyQuizzes = [
  { question: "What is the powerhouse of the cell?", options: ["Mitochondria", "Nucleus", "Chloroplast", "Endoplasmic Reticulum"], correctAnswer: 0 },
  { question: "Which vitamin is produced when the skin is exposed to sunlight?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], correctAnswer: 3 },
  { question: "What is the genetic material in all living organisms?", options: ["DNA", "RNA", "Proteins", "Carbohydrates"], correctAnswer: 0 },
  // Add more biology-related questions here...
];

// Sample random physics quizzes
const physicsQuizzes = [
  { question: "What is the unit of force?", options: ["Newton", "Joule", "Watt", "Pascal"], correctAnswer: 0 },
  { question: "What is the speed of light?", options: ["3 × 10^8 m/s", "2 × 10^8 m/s", "1 × 10^8 m/s", "5 × 10^8 m/s"], correctAnswer: 0 },
  { question: "Who developed the theory of relativity?", options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"], correctAnswer: 1 },
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
        const pollCount = parseInt(parts[2] || '1'); // Default to 1 if no number is provided

        if (subject === 'biology') {
          await sendQuizzes(ctx, biologyQuizzes, pollCount);
        } else if (subject === 'physics') {
          await sendQuizzes(ctx, physicsQuizzes, pollCount);
        } else {
          await ctx.reply(`Sorry, I don't have polls for ${subject}. Try typing /startpoll biology or /startpoll physics.`);
        }
      } else if (userMessage.includes('poll')) {
        await ctx.reply(`Hey ${userName}, I can help you create a quiz. Type /startpoll followed by a subject and the number of polls (e.g., /startpoll biology 2).`);
      }
    } else {
      // Handle non-text messages (e.g., media)
      await ctx.reply(`I can only respond to text messages. Please send a text command.`);
    }
  }
};

// Function to send quizzes based on the user input
const sendQuizzes = async (ctx: Context, quizzes: { question: string, options: string[], correctAnswer: number }[], pollCount: number) => {
  const chatId = ctx.chat?.id;

  if (chatId !== undefined) {
    let quizSent = 0;

    // Send the requested number of quizzes (1 if pollCount is 1, or more if specified)
    while (quizSent < pollCount) {
      const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
      try {
        // Send the quiz to the user
        await ctx.telegram.sendQuiz(chatId, randomQuiz.question, randomQuiz.options, {
          correct_option_id: randomQuiz.correctAnswer,
          is_anonymous: false, // Not anonymous to track the answers
          allows_multiple_answers: false,
        });
        quizSent++;
      } catch (error) {
        debug('Error sending quiz:', error);
        await ctx.reply('Something went wrong while sending the quiz.');
        break; // Stop if there's an error
      }
    }

    // Notify the user after sending the quizzes
    await ctx.reply(`You have completed ${quizSent} quiz${quizSent > 1 ? 'es' : ''}.`);
  } else {
    await ctx.reply('Chat ID is not valid. Please try again later.');
  }
};

export { poll };
