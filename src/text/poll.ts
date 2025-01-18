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
        let intervalTime = 30000; // Default to 30 seconds

        // Optional: Check if a custom interval is provided (e.g., /startpoll biology 60000 for 1 minute)
        if (parts.length > 2 && !isNaN(Number(parts[2]))) {
          intervalTime = Number(parts[2]);
        }

        if (subject === 'biology') {
          await sendQuizzes(ctx, biologyQuizzes, intervalTime);
        } else if (subject === 'physics') {
          await sendQuizzes(ctx, physicsQuizzes, intervalTime);
        } else {
          await ctx.reply(`Sorry, I don't have quizzes for ${subject}. Try typing /startpoll biology or /startpoll physics.`);
        }
      } else if (userMessage.includes('poll')) {
        await ctx.reply(`Hey ${userName}, I can help you create a quiz. Type /startpoll followed by a subject (e.g., /startpoll biology).`);
      }
    } else {
      // Handle non-text messages (e.g., media)
      await ctx.reply(`I can only respond to text messages. Please send a text command.`);
    }
  }
};

// Function to send 10 random quizzes with a customizable interval
const sendQuizzes = async (ctx: Context, quizzes: { question: string, options: string[], correctAnswer: number }[], intervalTime: number) => {
  const chatId = ctx.chat?.id;

  if (chatId !== undefined) {
    let quizCount = 0;

    const interval = setInterval(async () => {
      if (quizCount >= 10) {
        clearInterval(interval); // Stop after 10 quizzes
        await ctx.reply('You have completed all quizzes!');
      } else {
        const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
        try {
          // Send the quiz to the user
          await ctx.telegram.sendQuiz(chatId, randomQuiz.question, randomQuiz.options, {
            correct_option_id: randomQuiz.correctAnswer,
            is_anonymous: false, // Not anonymous to track the answers
            allows_multiple_answers: false,
          });
          quizCount++;
        } catch (error) {
          debug('Error sending quiz:', error);
          await ctx.reply('Something went wrong while sending the quiz.');
        }
      }
    }, intervalTime); // Use the user-defined interval time
  } else {
    await ctx.reply('Chat ID is not valid. Please try again later.');
  }
};

export { poll };
