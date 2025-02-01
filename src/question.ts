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
    const filePath = path.join(__dirname, 'question.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const questions: Question[] = JSON.parse(data);

    // Pick a random question
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    return randomQuestion;
  } catch (error) {
    console.error('Error reading questions:', error);
    return null;
  }
};

const question = () => async (ctx: Context) => {
  const q = getQuestion();
  if (q) {
    const message = `📖 *Question:*\n${q.question}\n\n🔹 Options:\n${q.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`;
    await ctx.replyWithMarkdown(message);
  } else {
    await ctx.reply('❌ Error fetching question. Please try again.');
  }
};

export { question };
