import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:poll');

// Sample random biology quizzes
const biologyQuizzes = [
  { "question": "What is the powerhouse of the cell?", "options": ["Mitochondria", "Nucleus", "Chloroplast", "Endoplasmic Reticulum"], "correctAnswer": 0 },
  { "question": "Which vitamin is produced when the skin is exposed to sunlight?", "options": ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], "correctAnswer": 3 },
  { "question": "What is the genetic material in all living organisms?", "options": ["DNA", "RNA", "Proteins", "Carbohydrates"], "correctAnswer": 0 },
  { "question": "How many times does decarboxylation occur during each TCA cycle?", "options": ["Thrice", "Many", "Once", "Twice"], "correctAnswer": 3 },
  { "question": "The dissolution of synaptonemal complex occurs during:", "options": ["Pachytene", "Diplotene", "Diakinesis", "Leptotene"], "correctAnswer": 1 },
  { "question": "Doubling of the number of chromosomes can be achieved by disrupting mitotic cell division soon after:", "options": ["Anaphase", "Telophase", "Prophase"], "correctAnswer": 0 }
];

// Sample random physics quizzes
const physicsQuizzes = [
  { "question": "What is the unit of force?", "options": ["Newton", "Joule", "Watt", "Pascal"], "correctAnswer": 0 },
  { "question": "What is the speed of light?", "options": ["3 × 10^8 m/s", "2 × 10^8 m/s", "1 × 10^8 m/s", "5 × 10^8 m/s"], "correctAnswer": 0 },
  { "question": "Who developed the theory of relativity?", "options": ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"], "correctAnswer": 1 }
];

// Main poll function
const poll = () => async (ctx: Context) => {
  debug('Triggered "poll" command');
  const messageId = ctx.message?.message_id;
  const userName = `${ctx.message?.from.first_name}`;
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (messageId && userMessage) {
    if (userMessage.startsWith('/startpoll')) {
      const [_, subject, count] = userMessage.split(' ');

      if (subject && subject === 'biology') {
        const numberOfQuestions = count ? parseInt(count) : 1; // Default to 1 question if no count is provided
        await sendRandomQuizzes(ctx, biologyQuizzes, numberOfQuestions);
      } else if (subject === 'physics') {
        const numberOfQuestions = count ? parseInt(count) : 1; // Default to 1 question if no count is provided
        await sendRandomQuizzes(ctx, physicsQuizzes, numberOfQuestions);
      } else {
        // Send 1 random quiz from either subject
        await sendRandomQuiz(ctx);
      }
    } else if (userMessage.includes('poll')) {
      await ctx.reply(`Hey ${userName}, I can help you create a quiz. Type /startpoll biology or /startpoll physics to get a quiz.`);
    } 
  }
};

// Function to send a random quiz from either biology or physics
const sendRandomQuiz = async (ctx: Context) => {
  const chatId = ctx.chat?.id;
  if (chatId !== undefined) {
    const allQuizzes = [...biologyQuizzes, ...physicsQuizzes];
    const randomQuiz = allQuizzes[Math.floor(Math.random() * allQuizzes.length)];
    try {
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

// Function to send multiple random quizzes from a specific subject
const sendRandomQuizzes = async (ctx: Context, quizzes: Array<any>, count: number) => {
  const chatId = ctx.chat?.id;
  if (chatId !== undefined) {
    const randomQuizzes = [];
    const uniqueQuizzes = new Set();

    while (uniqueQuizzes.size < count && uniqueQuizzes.size < quizzes.length) {
      const randomIndex = Math.floor(Math.random() * quizzes.length);
      const randomQuiz = quizzes[randomIndex];
      if (!uniqueQuizzes.has(randomQuiz.question)) {
        uniqueQuizzes.add(randomQuiz.question);
        randomQuizzes.push(randomQuiz);
      }
    }

    try {
      for (const quiz of randomQuizzes) {
        await ctx.telegram.sendQuiz(chatId, quiz.question, quiz.options, {
          correct_option_id: quiz.correctAnswer,
          is_anonymous: false, // Not anonymous to track the answers
          allows_multiple_answers: false,
        });
      }
    } catch (error) {
      debug('Error sending quizzes:', error);
      await ctx.reply('Something went wrong while sending the quizzes.');
    }
  } else {
    await ctx.reply('Chat ID is not valid. Please try again later.');
  }
};

export { poll };
