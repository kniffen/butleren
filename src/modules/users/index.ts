import { ChannelType } from 'discord.js';

import { commands } from './commands';

export const usersModule: BotModule = {
  id: 'users',
  name: 'Users',
  description: 'Adds user related features',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked: true,
  commands
};
