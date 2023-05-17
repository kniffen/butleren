import { ChannelType } from 'discord.js';

import commands from './commands';

export const funModule: BotModule = {
  id: 'fun',
  name: 'Fun',
  description: 'Adds some fun commands',
  isLocked: false,
  commands,
  allowedChannelTypes: [
    ChannelType.GuildText,
    ChannelType.DM
  ]
};