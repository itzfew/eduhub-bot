import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:calculator');

// Main calculator function
const calculator = () => async (ctx: Context) => {
  debug('Triggered "calculator" command');

  const messageId = ctx.message?.message_id;
  const userName = `${ctx.message?.from.first_name}`;

  // Get the message text or handle non-text messages
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (messageId) {
    if (userMessage) {
      // Extract operation and numbers from the command
      const parseMathExpression = (expression: string): number | string => {
        try {
          // Sanitize and evaluate the expression
          const sanitizedExpression = expression.replace(/[^\d+\-*/().]/g, ''); // Allow only numbers and operators
          return eval(sanitizedExpression);
        } catch (error) {
          return 'Invalid expression! Please ensure your input is correct.';
        }
      };

      if (userMessage.startsWith('/add')) {
        const expression = userMessage.replace('/add', '').trim();
        const result = parseMathExpression(expression);
        await ctx.reply(`The result of addition is: ${result}`);
      } else if (userMessage.startsWith('/subtract')) {
        const expression = userMessage.replace('/subtract', '').trim();
        const result = parseMathExpression(expression);
        await ctx.reply(`The result of subtraction is: ${result}`);
      } else if (userMessage.startsWith('/multiply')) {
        const expression = userMessage.replace('/multiply', '').trim();
        const result = parseMathExpression(expression);
        await ctx.reply(`The result of multiplication is: ${result}`);
      } else if (userMessage.startsWith('/divide')) {
        const expression = userMessage.replace('/divide', '').trim();
        const result = parseMathExpression(expression);
        await ctx.reply(`The result of division is: ${result}`);
      } else if (userMessage.includes('/commands')) {
        await ctx.reply(`Calculator Bot Commands:
        
1. /add <expression> - Add numbers (e.g., /add 2+3)
2. /subtract <expression> - Subtract numbers (e.g., /subtract 5-2)
3. /multiply <expression> - Multiply numbers (e.g., /multiply 3*4)
4. /divide <expression> - Divide numbers (e.g., /divide 8/2)`);
      } else {
        await ctx.reply(`I didn't understand that command, ${userName}. Use /commands to see what I can do.`);
      }
    } else {
      // Handle non-text messages (e.g., media)
      await ctx.reply(`I can only respond to text messages. Please send a text command.`);
    }
  }
};

export { calculator };
