import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:group_commands');

// Main group management function
const groupCommands = () => async (ctx: Context) => {
  debug('Triggered "group" command');

  const messageId = ctx.message?.message_id;
  const userName = `${ctx.message?.from.first_name}`;
  
  // Get the message text or handle non-text messages
  const userMessage = ctx.message && 'text' in ctx.message ? ctx.message.text.toLowerCase() : null;

  if (messageId) {
    if (userMessage) {
      // Process text messages only
      if (userMessage === '/create_group') {
        // Logic to create a group
        await ctx.reply(`Group created successfully! You can now add members.`);
      } else if (userMessage === '/list_groups') {
        // Logic to list groups
        await ctx.reply(`Here are your groups:\n1. Group A\n2. Group B\n3. Group C`);
      } else if (userMessage.includes('/add_member')) {
        const memberName = userMessage.split(' ')[1]; // Get the member's name or username after the command
        if (memberName) {
          // Logic to add a member to the group
          await ctx.reply(`${memberName} has been added to the group.`);
        } else {
          await ctx.reply(`Please provide the name or username of the member to add.`);
        }
      } else if (userMessage.includes('/remove_member')) {
        const memberName = userMessage.split(' ')[1]; // Get the member's name or username after the command
        if (memberName) {
          // Logic to remove a member from the group
          await ctx.reply(`${memberName} has been removed from the group.`);
        } else {
          await ctx.reply(`Please provide the name or username of the member to remove.`);
        }
      } else if (userMessage === '/group_help') {
        // Display available group commands
        await ctx.reply(`Group Management Commands:
1. /create_group - Create a new group
2. /list_groups - List all your groups
3. /add_member [name/username] - Add a member to a group
4. /remove_member [name/username] - Remove a member from a group
5. /group_help - Show this help message`);
      }
      // Additional group-specific commands can be added here
    } else {
      // Handle non-text messages (e.g., media)
      await ctx.reply(`I can only respond to text messages. Please send a text command.`);
    }
  }
};

export { groupCommands };
