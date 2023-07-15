import { ChannelType } from 'discord.js';

import { commands } from './commands';

export const infoModule: BotModule = {
  id: 'info',
  name: 'Info',
  description: 'Adds various informative commands',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked: true,
  commands
};