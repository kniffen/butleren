import { ChannelType } from 'discord.js';

import { commands } from './commands';
import { BotModule } from '../../types/butleren';

export const usersModule: BotModule = {
  id: 'users',
  name: 'Users',
  description: 'Adds user related features',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked: true,
  commands
};
