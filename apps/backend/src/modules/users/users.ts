import { ChannelType } from 'discord.js';
import type { BotCommand, BotModule } from '../../types';
import { usersRouter } from './api/router';
import { locationCommand } from './commands/location/location';

const commands = new Map<string, BotCommand>([
  [locationCommand.slashCommandBuilder.name, locationCommand],
]);

export const users: BotModule = {
  slug:                'users',
  name:                'Users',
  description:         'User management',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked:            true,
  commands,
  router:              usersRouter,
  defaultSettings:     { isEnabled: true },
};