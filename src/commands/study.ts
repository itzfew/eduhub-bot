import { Context } from 'telegraf';
import createDebug from 'debug';

import { name } from '../../package.json';  // Assuming 'name' is already imported from package.json

const debug = createDebug('bot:study_command');

const study = () => async (ctx: Context) => {
  const message = `*${name} Study Resources*:
  \n\n
   Akash Resources:
  - Akash Test Series 2024
  - Akash Modules 2024

   Allen Resources:
  - Allen Modules
  - Allen Test 2024

   Physics Wallah & Med Easy Resources:
  - Med Easy Physics Original
  - Botany Med Easy
  - Zoology Med Easy
  - Chemistry - Know Your NCERT
  - Physics - Know Your NCERT
  - Biology Punch
  - Chemistry Punch
  - Physics Punch

   Additional Resources:
  - Biohack 4th Edition by Parth Goyal
  - NEET 11 Years Chapterwise PYQ
  - NTA NEET Speed Test
  - NCERT Diagrams All-in-One`;

  debug(`Triggered "study" command with message \n${message}`);
  
  await ctx.reply(message); // Send grouped message
};

export { study };
