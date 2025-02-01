import { Context } from 'telegraf';
import fs from 'fs';
import path from 'path';

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

const getQuestion = (): Question | null => {
  try {
    const filePath = path.join(__dirname, '../question.json'); // Adjust path if needed
    console.log('Reading from:', filePath);

    if (!fs.existsSync(filePath)) {
      console.error('⚠️ question.json file not found!');
      return null;
    }

    const data = fs.readFileSync(filePath, 'utf8');
    const questions: Question[] = JSON.parse(data);

    if (questions.length === 0) {
      console.error('⚠️ No questions found in question.json!');
      return null;
    }

    // Pick a random question
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    console.log('📖 Selected Question:', randomQuestion.question);

    return randomQuestion;
  } catch (error) {
    console.error('❌ Error reading questions:', error);
    return null;
  }
};

const question = () => async (ctx: Context) => {
  console.log('📩 Received /question command');
  const q = getQuestion();

  if (q) {
    const message = `📖 *Question:*\n${q.question}\n\n🔹 Options:\n${q.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`;
    await ctx.replyWithMarkdown(message);
  } else {
    await ctx.reply('❌ Error fetching question. Please try again.');
  }
};

export { question };
