import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:calculator');

// Main calculator function
const calculator = () => async (ctx: Context) => {
  debug('Triggered calculator command');

  const messageId = ctx.message?.message_id;
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.trim() : null;

  if (messageId && userMessage) {
    // Extract the command and arguments
    const [command, ...args] = userMessage.split(' ');

    switch (command.toLowerCase()) {
      case '/add': {
        const numbers = args.map(Number);
        if (numbers.some(isNaN)) {
          await ctx.reply('Please provide valid numbers. Example: /add 5 10');
        } else {
          const sum = numbers.reduce((acc, num) => acc + num, 0);
          await ctx.reply(`The sum is: ${sum}`);
        }
        break;
      }

      case '/subtract': {
        if (args.length < 2) {
          await ctx.reply('Please provide at least two numbers. Example: /subtract 10 5');
        } else {
          const numbers = args.map(Number);
          if (numbers.some(isNaN)) {
            await ctx.reply('Please provide valid numbers.');
          } else {
            const difference = numbers.reduce((acc, num) => acc - num);
            await ctx.reply(`The result is: ${difference}`);
          }
        }
        break;
      }

      case '/multiply': {
        const numbers = args.map(Number);
        if (numbers.some(isNaN)) {
          await ctx.reply('Please provide valid numbers. Example: /multiply 5 10');
        } else {
          const product = numbers.reduce((acc, num) => acc * num, 1);
          await ctx.reply(`The product is: ${product}`);
        }
        break;
      }

      case '/divide': {
        if (args.length !== 2) {
          await ctx.reply('Please provide exactly two numbers. Example: /divide 10 2');
        } else {
          const [num1, num2] = args.map(Number);
          if (isNaN(num1) || isNaN(num2)) {
            await ctx.reply('Please provide valid numbers.');
          } else if (num2 === 0) {
            await ctx.reply('Division by zero is not allowed.');
          } else {
            const quotient = num1 / num2;
            await ctx.reply(`The result is: ${quotient}`);
          }
        }
        break;
      }

      case '/calculate': {
        const expression = args.join(' ');
        try {
          // Evaluate the expression securely
          const result = eval(expression); // Use with caution in real-world apps, consider a math library for safety
          await ctx.reply(`The result of "${expression}" is: ${result}`);
        } catch (err) {
          await ctx.reply('Invalid expression. Please provide a valid mathematical expression.');
        }
        break;
      }

      case '/calc_help': {
        await ctx.reply(`Calculator Commands:
1. /add [numbers] - Add numbers. Example: /add 5 10
2. /subtract [numbers] - Subtract numbers. Example: /subtract 10 5
3. /multiply [numbers] - Multiply numbers. Example: /multiply 2 3
4. /divide [num1] [num2] - Divide two numbers. Example: /divide 10 2
5. /calculate [expression] - Evaluate a mathematical expression. Example: /calculate 5 + 10 * 2
6. /calc_help - Show this help message`);
        break;
      }

      default: {
        await ctx.reply('Invalid command. Type /calc_help to see the list of available commands.');
      }
    }
  }
};

export { calculator };
