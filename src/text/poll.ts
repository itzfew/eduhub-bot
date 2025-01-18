import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:poll');

// Sample list of biology questions (you can add more questions)
const bioQuestions = [
  { question: "What is the powerhouse of the cell?", options: ["Mitochondria", "Nucleus", "Ribosome", "Endoplasmic Reticulum"], correctAnswer: "Mitochondria" },
  { question: "What is the chemical formula for water?", options: ["H2O", "CO2", "O2", "H2O2"], correctAnswer: "H2O" },
  { question: "What is the main function of red blood cells?", options: ["Transport oxygen", "Fight infection", "Produce hormones", "Carry nutrients"], correctAnswer: "Transport oxygen" },
  { question: "Which organ is responsible for detoxifying the body?", options: ["Liver", "Heart", "Lungs", "Kidney"], correctAnswer: "Liver" },
  { question: "What process do plants use to make food?", options: ["Photosynthesis", "Respiration", "Digestion", "Transpiration"], correctAnswer: "Photosynthesis" },
  { question: "What is the largest organ in the human body?", options: ["Skin", "Liver", "Brain", "Heart"], correctAnswer: "Skin" },
  { question: "What is DNA responsible for?", options: ["Carrying genetic information", "Producing energy", "Regulating hormones", "Making proteins"], correctAnswer: "Carrying genetic information" },
  { question: "Which gas do humans exhale?", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"], correctAnswer: "Carbon dioxide" },
  { question: "What part of the plant absorbs water?", options: ["Roots", "Leaves", "Stem", "Flowers"], correctAnswer: "Roots" },
  { question: "What is the function of the chloroplast?", options: ["Photosynthesis", "Respiration", "Circulation", "Digestion"], correctAnswer: "Photosynthesis" },
];

// Main poll function (with multiple questions and results)
const poll = () => async (ctx: Context) => {
  debug('Triggered "poll" command');

  const messageId = ctx.message?.message_id;
  const userName = `${ctx.message?.from.first_name}`;
  
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;
  
  if (messageId) {
    if (userMessage) {
      // Handle "/startpoll bio"
      if (userMessage === '/startpoll bio') {
        // Randomly shuffle the questions and select 10
        const selectedQuestions = bioQuestions.sort(() => Math.random() - 0.5).slice(0, 10);

        let questionIndex = 0;
        let score = 0;

        // Start the quiz with the first question
        const askNextQuestion = async () => {
          if (questionIndex < selectedQuestions.length) {
            const { question, options } = selectedQuestions[questionIndex];
            const chatId = ctx.chat?.id;
            if (chatId !== undefined) {
              try {
                const pollMessage = await ctx.telegram.sendPoll(chatId, question, options, {
                  is_anonymous: false,
                  allows_multiple_answers: false,
                });

                // Wait for a response on the poll (no need to use 'on')
                ctx.on('poll_answer', async (answerCtx) => {
                  const userAnswer = answerCtx.poll_answer.option_ids;
                  const selectedOption = options[userAnswer[0]];

                  // Provide feedback on the answer
                  if (selectedOption === selectedQuestions[questionIndex].correctAnswer) {
                    score++;
                    await ctx.reply(`${userName}, your answer is correct! 🎉`);
                  } else {
                    await ctx.reply(`${userName}, your answer is incorrect. Try again! ❌`);
                  }

                  // Move to the next question
                  questionIndex++;
                  await askNextQuestion(); // Ask next question
                });
              } catch (error) {
                debug('Error sending poll:', error);
                await ctx.reply('Something went wrong while sending the poll.');
              }
            }
          } else {
            // Quiz completed, show results
            await ctx.reply(`${userName}, you finished the quiz! Your score is: ${score} out of ${selectedQuestions.length}. 🎉`);
          }
        };

        // Start the first question
        await askNextQuestion();

      } else if (userMessage.includes('poll')) {
        await ctx.reply(`Hey ${userName}, I can help you create a quiz! Type /startpoll bio to begin!`);
      }
    } else {
      await ctx.reply(`I can only respond to text messages. Please send a text command.`);
    }
  }
};

export { poll };
