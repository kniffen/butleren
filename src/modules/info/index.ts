import { ChannelType } from 'discord.js';

import { commands } from './commands';
import { BotModule } from '../../types/butleren';

export const infoModule: BotModule = {
  id: 'info',
  name: 'Info',
  description: 'Adds various informative commands',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked: true,
  commands
};