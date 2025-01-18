import { Context } from 'telegraf';
import createDebug from 'debug';
import fetch from 'node-fetch';

const debug = createDebug('bot:fun_interaction');

// Main fun interaction function
const funInteraction = () => async (ctx: Context) => {
  debug('Triggered "fun_interaction" function');

  const messageId = ctx.message?.message_id;
  const userName = `${ctx.message?.from.first_name}`;

  // Get the message text or handle non-text messages
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (messageId) {
    if (userMessage) {
      // Process text messages only
      if (userMessage === '/joke') {
        // Fetch a random joke
        const response = await fetch('https://official-joke-api.appspot.com/random_joke');
        const jokeData = await response.json();
        await ctx.reply(`${jokeData.setup} - ${jokeData.punchline}`);
      } else if (userMessage === '/quote') {
        // Fetch a motivational quote
        const response = await fetch('https://api.quotable.io/random');
        const quoteData = await response.json();
        await ctx.reply(`Here's a motivational quote for you: "${quoteData.content}" - ${quoteData.author}`);
      } else if (userMessage === '/weather') {
        // Fetch the weather of a city
        const city = 'London'; // You can ask users for city input
        const apiKey = 'YOUR_OPENWEATHER_API_KEY';
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const weatherData = await response.json();
        const temperature = weatherData.main.temp;
        await ctx.reply(`The current temperature in ${city} is ${temperature}°C.`);
      } else {
        await ctx.reply(`Hey ${userName}, I can tell you a joke, quote, or weather info. Just type /joke, /quote, or /weather!`);
      }
    } else {
      // Handle non-text messages (e.g., media)
      await ctx.reply(`I can only respond to text messages. Please send a text command like /joke, /quote, or /weather.`);
    }
  }
};

export { funInteraction };
