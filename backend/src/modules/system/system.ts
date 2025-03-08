import { ChannelType } from 'discord.js';
import type { Module } from '../../types';
import { pingCommand } from './commands/ping';
import { statusCommand } from './commands/status';

const commands = new Map([
  [pingCommand.slashCommandBuilder.name,   pingCommand],
  [statusCommand.slashCommandBuilder.name, statusCommand],
]);

export const system: Module = {
  slug:                'system',
  name:                'System',
  description:         'System utilities',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked:            true,
  commands,
};