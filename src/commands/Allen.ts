import { Context } from 'telegraf';

// Type Guard to check if the message has a text property
function isTextMessage(message: any): message is { text: string } {
  return message && message.text;
}

export const keywordReply = () => async (ctx: Context) => {
  const message = ctx.message;

  // Check if the message is a text message
  if (isTextMessage(message)) {
    const messageText = message.text;

    // Check for the keywords in the message text
    if (/(Akash|Allen|pw|pdf|study)/i.test(messageText)) {
      await ctx.reply("Hello dear, I am here to try");
    }
  } else {
    console.log("Received a non-text message");
  }
};
