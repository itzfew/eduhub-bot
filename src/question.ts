import { Context } from 'telegraf';

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

const GITHUB_QUESTION_URL =
  'https://raw.githubusercontent.com/itzfew/eduhub-bot/master/src/question.json'; // Corrected URL

const getQuestion = async (): Promise<Question | null> => {
  try {
    const response = await fetch(GITHUB_QUESTION_URL);
    
    if (!response.ok) {
      console.error('⚠️ Failed to fetch question.json from GitHub');
      return null;
    }

    const questions: Question[] = await response.json();

    if (questions.length === 0) {
      console.error('⚠️ No questions found in question.json!');
      return null;
    }

    // Pick a random question
    return questions[Math.floor(Math.random() * questions.length)];
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
  } else {
    await ctx.reply('❌ Error fetching question. Please try again.');
  }
};

export { question };
