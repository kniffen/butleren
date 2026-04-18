import { ChannelType } from 'discord.js';
import type { BotModule, BotCommand } from '../../types';
import { pingCommand } from './commands/ping';
import { statusCommand } from './commands/status';
import { modulesRouter } from './api/router';

const commands = new Map<string, BotCommand>([
  [pingCommand.slashCommandBuilder.name,   pingCommand],
  [statusCommand.slashCommandBuilder.name, statusCommand],
]);

export const core: BotModule = {
  slug:                'core',
  name:                'Core',
  description:         'Core bot features',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked:            true,
  commands,
  router:              modulesRouter,
  defaultSettings:     { isEnabled: true },
};