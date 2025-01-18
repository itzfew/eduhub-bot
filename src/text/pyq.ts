import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:pyq_text');

// Base URL for quizzes
const baseUrl = 'https://quizes.pages.dev/play?title=';

// Array of quiz data with the specified format
const quizData = [
  {
    "title": "jee-main-misc",
    "papers": [
      {
        "exam": "jee-main-misc",
        "examGroup": "jee",
        "metaId": "emb-ait1",
        "title": "JEE Main 2024 Misc Paper 1",
        "year": 2024
      },
      {
        "exam": "jee-main-misc",
        "examGroup": "jee",
        "metaId": "emb-ait2",
        "title": "JEE Main 2024 Misc Paper 2",
        "year": 2024
      },
      {
        "exam": "jee-main-misc",
        "examGroup": "jee",
        "metaId": "emb-ait3",
        "title": "JEE Main 2024 Misc Paper 3",
        "year": 2024
      },
      {
        "exam": "jee-main-misc",
        "examGroup": "jee",
        "metaId": "emb-ait4",
        "title": "JEE Main 2024 Misc Paper 4",
        "year": 2024
      }
    ]
  }
];

const pyq = () => async (ctx: Context) => {
  debug('Triggered "pyq" text command');

  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (userMessage) {
    const userName = ctx.from?.first_name || 'Dear User';  // Retrieve user's first name

    // If the user sends /pyq or /exam
    if (userMessage === '/pyq' || userMessage === '/exam') {
      const exams = Array.from(new Set(quizData.map(quiz => quiz.papers[0].exam)));  // Extract unique exams
      let examList = 'Please select an exam:\n\n';

      exams.forEach((exam, index) => {
        examList += `${index + 1}. ${exam}\n`;  // Display available exams
      });

      examList += '\nPlease reply with the number of the exam you want to choose (e.g., 1, 2, etc.).';

      // Send the exam list
      await ctx.reply(examList);
    }

    // If the user selects an exam
    else if (/^\d+$/.test(userMessage)) {
      const examNumber = parseInt(userMessage, 10);
      const exams = Array.from(new Set(quizData.map(quiz => quiz.papers[0].exam)));

      if (examNumber > 0 && examNumber <= exams.length) {
        const selectedExam = exams[examNumber - 1];  // Get selected exam

        // Find quizzes related to the selected exam
        const quizzesInExam = quizData.filter(quiz => quiz.papers[0].exam === selectedExam);

        let quizList = `You selected the ${selectedExam} exam. Here are the available quizzes:\n\n`;
        quizzesInExam.forEach((quiz, quizIndex) => {
          quizList += `${quizIndex + 1 + examNumber - 1}. ${quiz.title.replace('-', ' ').toUpperCase()}\n`;  // Display quiz titles with corrected numbering
          quiz.papers.forEach((paper, paperIndex) => {
            const paperNumber = `${quizIndex + 1 + examNumber - 1}.${paperIndex + 1}`;  // Correct paper numbering
            quizList += `  ${paperNumber}. ${paper.title} (${paper.year})\n`; // Display papers under each quiz
          });
        });

        quizList += '\nPlease reply with the number of the quiz you want to play (e.g., 2.1, 2.2, etc.).';

        // Send the list of quizzes for the selected exam
        await ctx.reply(quizList);
      } else {
        // If the exam number is not valid
        await ctx.reply('Invalid option. Please choose a valid exam number (e.g., 1, 2, etc.).');
      }
    }

    // If the user selects a quiz/paper
    else if (/^\d+(\.\d+)?$/.test(userMessage)) {
      const parts = userMessage.split('.');
      const quizNumber = parseInt(parts[0], 10);
      const paperNumber = parts[1] ? parseInt(parts[1], 10) - 1 : null; // If there's a sub-quiz, get it

      // Check if the input number is valid and within the range of available quizzes
      if (quizNumber > 0 && quizNumber <= quizData.length) {
        const quiz = quizData[quizNumber - 1]; // Get the quiz data based on the user's input

        if (paperNumber !== null && paperNumber >= 0 && paperNumber < quiz.papers.length) {
          const paper = quiz.papers[paperNumber];
          const quizLink = `${baseUrl}${encodeURIComponent(paper.title)}&metaId=${paper.metaId}`;

          // Send a clickable message with the quiz link
          await ctx.reply(`Hey ${userName}, play the following quiz: [${paper.title} - ${paper.year}](${quizLink})`);

          // Send the bot share button using reply with inline keyboard
          await ctx.reply('Share the bot with your friends:', {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Share with friends',
                    url: 'https://t.me/IndianChatgpt_bot',
                  },
                ],
              ],
            },
          });
        } else {
          // If the paper input number is not valid
          await ctx.reply('Invalid option. Please choose a valid paper number (e.g., 1, 1.1, etc.).');
        }
      } else {
        // If the input number is not valid
        await ctx.reply('Invalid option. Please choose a valid quiz number (e.g., 1, 1.1, etc.).');
      }
    } else {
      // Handle case when the user input is not a valid number or command
      await ctx.reply('Please enter a valid command (e.g., /pyq or /exam) or a valid number (e.g., 1, 1.1, etc.) to get the quiz link.');
    }
  }
};

export { pyq };
