import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:poll');

// Sample random biology quizzes
const biologyQuizzes = [
  {
    "question": "What is the powerhouse of the cell?",
    "options": ["Mitochondria", "Nucleus", "Chloroplast", "Endoplasmic Reticulum"],
    "correctAnswer": 0
  },
  {
    "question": "Which vitamin is produced when the skin is exposed to sunlight?",
    "options": ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
    "correctAnswer": 3
  },
  {
    "question": "What is the genetic material in all living organisms?",
    "options": ["DNA", "RNA", "Proteins", "Carbohydrates"],
    "correctAnswer": 0
  },
  {
    "question": "How many times does decarboxylation occur during each TCA cycle?",
    "options": ["Thrice", "Many", "Once", "Twice"],
    "correctAnswer": 3
  },
  {
    "question": "The dissolution of synaptonemal complex occurs during:",
    "options": ["Pachytene", "Diplotene", "Diakinesis", "Leptotene"],
    "correctAnswer": 1
  },
  {
    "question": "Doubling of the number of chromosomes can be achieved by disrupting mitotic cell division soon after:",
    "options": ["Anaphase", "Telophase", "Prophase"],
    "correctAnswer": 0
  },
];

// Sample random physics quizzes
const physicsQuizzes = [
  {
    "question": "What is the unit of force?",
    "options": ["Newton", "Joule", "Watt", "Pascal"],
    "correctAnswer": 0
  },
  {
    "question": "What is the speed of light?",
    "options": ["3 × 10^8 m/s", "2 × 10^8 m/s", "1 × 10^8 m/s", "5 × 10^8 m/s"],
    "correctAnswer": 0
  },
  {
    "question": "Who developed the theory of relativity?",
    "options": ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"],
    "correctAnswer": 1
  },
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
        const subject = parts[1]; // biology or physics
        const numberOfQuestions = parseInt(parts[2]); // number of questions

        if (subject === 'biology' || subject === 'physics') {
          await sendRandomQuizzes(ctx, subject, numberOfQuestions);
        } else {
          await ctx.reply("Please specify a valid subject: 'biology' or 'physics'.");
        }
      } else if (userMessage.includes('poll')) {
        await ctx.reply(`Hey ${userName}, I can help you create a quiz. Type /startpoll to get a random quiz from biology or physics.`);
      }
    } else {
      // Handle non-text messages (e.g., media)
      await ctx.reply(`I can only respond to text messages. Please send a text command.`);
    }
  }
};

// Function to send a specified number of random quizzes from a particular subject
const sendRandomQuizzes = async (ctx: Context, subject: string, numberOfQuestions: number) => {
  const chatId = ctx.chat?.id;

  if (chatId !== undefined) {
    // Select the correct quiz array based on subject
    const quizzes = subject === 'biology' ? biologyQuizzes : physicsQuizzes;

    // Get the number of quizzes to send (ensure we don't exceed the array length)
    const selectedQuizzes = [];
    for (let i = 0; i < numberOfQuestions; i++) {
      const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
      selectedQuizzes.push(randomQuiz);
    }

    try {
      // Send each quiz to the user
      for (const quiz of selectedQuizzes) {
        await ctx.telegram.sendQuiz(chatId, quiz.question, quiz.options, {
          correct_option_id: quiz.correctAnswer,
          is_anonymous: false, // Not anonymous to track the answers
          allows_multiple_answers: false,
        });
      }
    } catch (error) {
      debug('Error sending quiz:', error);
      await ctx.reply('Something went wrong while sending the quizzes.');
    }
  } else {
    await ctx.reply('Chat ID is not valid. Please try again later.');
  }
};

export { poll };
