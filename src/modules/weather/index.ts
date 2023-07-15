import { ChannelType } from 'discord.js';
import { commands } from './commands';

export const weatherModule: BotModule = {
  id: 'weather',
  name: 'Weather',
  description: 'Provides weather reports',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked: false,
  commands
};