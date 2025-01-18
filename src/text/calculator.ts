import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:calculator');

// Main calculator function
const calculator = () => async (ctx: Context) => {
  debug('Triggered "calculator" command');

  const userName = `${ctx.message?.from.first_name || 'User'}`;
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  // Helper to evaluate mathematical expressions
  const parseMathExpression = (expression: string): number | string => {
    try {
      const sanitizedExpression = expression.replace(/[^\d+\-*/().]/g, ''); // Allow only numbers and operators
      return eval(sanitizedExpression);
    } catch {
      return 'Invalid expression! Please ensure your input is correct.';
    }
  };

  // Helper to standardize expressions
  const standardizeExpression = (message: string): string => {
    return message
      .replace(/plus|add|addition/g, '+')
      .replace(/minus|subtract|subtraction/g, '-')
      .replace(/times|multiply|multiplication|×/g, '*')
      .replace(/divided by|divide|division|÷/g, '/')
      .replace(/\s+/g, ''); // Remove unnecessary spaces
  };

  if (userMessage) {
    if (userMessage.startsWith('/add') || userMessage.includes('plus') || userMessage.includes('add')) {
      const expression = standardizeExpression(userMessage.replace('/add', '').trim());
      const result = parseMathExpression(expression);
      await ctx.reply(`The result of addition is: ${result}`);
    } else if (userMessage.startsWith('/subtract') || userMessage.includes('minus') || userMessage.includes('subtract')) {
      const expression = standardizeExpression(userMessage.replace('/subtract', '').trim());
      const result = parseMathExpression(expression);
      await ctx.reply(`The result of subtraction is: ${result}`);
    } else if (userMessage.startsWith('/multiply') || userMessage.includes('times') || userMessage.includes('multiply')) {
      const expression = standardizeExpression(userMessage.replace('/multiply', '').trim());
      const result = parseMathExpression(expression);
      await ctx.reply(`The result of multiplication is: ${result}`);
    } else if (userMessage.startsWith('/divide') || userMessage.includes('divided by') || userMessage.includes('divide')) {
      const expression = standardizeExpression(userMessage.replace('/divide', '').trim());
      const result = parseMathExpression(expression);
      await ctx.reply(`The result of division is: ${result}`);
    } else if (userMessage.includes('/cal')) {
      await ctx.reply(`Calculator Bot Commands:
      
1. /add <expression> - Add numbers (e.g., /add 2+3, 2 plus 3)
2. /subtract <expression> - Subtract numbers (e.g., /subtract 5-2, 5 minus 2)
3. /multiply <expression> - Multiply numbers (e.g., /multiply 3*4, 3 times 4)
4. /divide <expression> - Divide numbers (e.g., /divide 8/2, 8 divided by 2)

You can also type expressions directly using words or symbols like:
- "2 plus 2" or "2 + 2"
- "6 divided by 3" or "6 / 3"
- "4 times 5" or "4 * 5"
- "7 minus 2" or "7 - 2"`);
    }
    // No response for unknown commands or messages
  }
};

export { calculator };
