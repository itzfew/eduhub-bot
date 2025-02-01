import { Context } from 'telegraf';

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

// 🔗 Corrected GitHub Raw URL
const GITHUB_QUESTION_URL =
  'https://raw.githubusercontent.com/itzfew/eduhub-bot/master/src/question.json';

const getQuestion = async (): Promise<Question | null> => {
  try {
    console.log('🌍 Fetching question.json...');
    
    const response = await fetch(GITHUB_QUESTION_URL);
    
    if (!response.ok) {
      console.error(`⚠️ Failed to fetch question.json: ${response.status}`);
      return null;
    }

    const questions: Question[] = await response.json();
    console.log('✅ Fetched questions:', questions.length);

    if (questions.length === 0) {
      console.error('⚠️ No questions found in question.json!');
      return null;
    }

    // Pick a random question
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    console.log('📖 Selected Question:', randomQuestion);

    return randomQuestion;
  } catch (error) {
    console.error('❌ Error fetching questions:', error);
    return null;
  }
};

const question = () => async (ctx: Context) => {
  console.log('📩 Received /question command');
  const q = await getQuestion();

  if (q) {
    const message = `📖 *Question:*\n${q.question}\n\n🔹 Options:\n${q.options
      .map((opt, i) => `${i + 1}. ${opt}`)
      .join('\n')}`;
    
    await ctx.replyWithMarkdown(message);
    console.log('📤 Question sent!');
  } else {
    await ctx.reply('❌ Error fetching question. Please try again.');
  }
};

export { question };
