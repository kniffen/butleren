import { ChannelType } from 'discord.js';
import type { Module } from '../../types';
import { dadjokeCommand } from './commands/dadjoke';
import { flipCommand } from './commands/flip';
import { xkcdCommand } from './commands/xkcd';

const commands = new Map([
  [dadjokeCommand.slashCommandBuilder.name, dadjokeCommand],
  [flipCommand.slashCommandBuilder.name,    flipCommand],
  [xkcdCommand.slashCommandBuilder.name,    xkcdCommand],
]);

export const fun: Module = {
  slug:                'fun',
  name:                'Fun',
  description:         'A collection of fun commands',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked:            false,
  commands,
};