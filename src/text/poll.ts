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
  { "question": "Doubling of the number of chromosomes can be achieved by disrupting mitotic cell division soon after:", "options": ["Anaphase", "Telophase", "Prophase"], "correctAnswer": 0 },
  {
  "question": "What is the largest organ in the human body?",
  "options": ["Heart", "Brain", "Liver", "Skin"],
  "correctAnswer": 3
},
{
  "question": "Which part of the plant is responsible for photosynthesis?",
  "options": ["Roots", "Stem", "Leaves", "Flowers"],
  "correctAnswer": 2
},
{
  "question": "What is the process by which plants make their own food?",
  "options": ["Respiration", "Transpiration", "Photosynthesis", "Fermentation"],
  "correctAnswer": 2
},
{
  "question": "Which gas do plants absorb during photosynthesis?",
  "options": ["Oxygen", "Nitrogen", "Carbon Dioxide", "Methane"],
  "correctAnswer": 2
},
{
  "question": "What is the function of red blood cells?",
  "options": ["Fight infections", "Carry oxygen", "Regulate body temperature", "Control body movement"],
  "correctAnswer": 1
},
{
  "question": "What type of bond holds the two strands of a DNA molecule together?",
  "options": ["Ionic bond", "Covalent bond", "Hydrogen bond", "Peptide bond"],
  "correctAnswer": 2
},
{
  "question": "Which organelle is known as the 'control center' of the cell?",
  "options": ["Nucleus", "Mitochondria", "Chloroplast", "Golgi Apparatus"],
  "correctAnswer": 0
},
{
  "question": "Which vitamin helps in the absorption of calcium?",
  "options": ["Vitamin A", "Vitamin B", "Vitamin D", "Vitamin K"],
  "correctAnswer": 2
},
{
  "question": "What is the primary source of energy for the human body?",
  "options": ["Fats", "Carbohydrates", "Proteins", "Vitamins"],
  "correctAnswer": 1
},
{
  "question": "Which of the following is NOT a part of the cell theory?",
  "options": ["All living organisms are made of cells", "The cell is the basic unit of life", "All cells have a nucleus", "Cells arise from pre-existing cells"],
  "correctAnswer": 2
},
  {
  "question": "Which of the following is a characteristic of a prokaryotic cell?",
  "options": ["Presence of a nucleus", "Presence of membrane-bound organelles", "Lack of a nucleus", "Presence of a Golgi apparatus"],
  "correctAnswer": 2
},
{
  "question": "What is the function of insulin in the human body?",
  "options": ["Regulates blood sugar levels", "Promotes digestion", "Regulates heartbeat", "Stimulates immune response"],
  "correctAnswer": 0
},
{
  "question": "Which of the following is a neurotransmitter?",
  "options": ["Insulin", "Adrenaline", "Glucagon", "Oxytocin"],
  "correctAnswer": 1
},
{
  "question": "Which of the following occurs during the light reaction of photosynthesis?",
  "options": ["Glucose is produced", "Oxygen is released", "Carbon dioxide is absorbed", "Water is synthesized"],
  "correctAnswer": 1
},
{
  "question": "What is the main function of the large intestine?",
  "options": ["Absorption of nutrients", "Absorption of water and salts", "Digestion of proteins", "Secretion of digestive enzymes"],
  "correctAnswer": 1
},
{
  "question": "Which type of immunity is acquired through vaccination?",
  "options": ["Innate immunity", "Active immunity", "Passive immunity", "Cell-mediated immunity"],
  "correctAnswer": 1
},
{
  "question": "Which enzyme is responsible for breaking down starch into sugar?",
  "options": ["Pepsin", "Amylase", "Lipase", "Trypsin"],
  "correctAnswer": 1
},
{
  "question": "Which of the following is the correct sequence of events in the cell cycle?",
  "options": ["G1 → S → G2 → M", "S → G1 → G2 → M", "M → G1 → S → G2", "G2 → S → G1 → M"],
  "correctAnswer": 0
},
{
  "question": "Which hormone is secreted by the pancreas to reduce blood sugar levels?",
  "options": ["Insulin", "Glucagon", "Adrenaline", "Cortisol"],
  "correctAnswer": 0
},
{
  "question": "Which of the following is a function of the liver?",
  "options": ["Storage of glycogen", "Production of insulin", "Production of bile", "All of the above"],
  "correctAnswer": 3
}
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
