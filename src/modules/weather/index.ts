import { ChannelType } from 'discord.js';

import { commands } from './commands';
import { BotModule } from '../../types/butleren';

export const weatherModule: BotModule = {
  id: 'weather',
  name: 'Weather',
  description: 'Provides weather reports',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked: false,
  commands
};