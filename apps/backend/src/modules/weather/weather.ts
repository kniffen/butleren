import { ChannelType } from 'discord.js';
import type { BotCommand, BotModule } from '../../types';
import { weatherCommand } from './commands/weather';
import { forecastCommand } from './commands/forecast';
import { pollenCommand } from './commands/pollen';

const commands = new Map<string, BotCommand>([
  [weatherCommand.slashCommandBuilder.name, weatherCommand],
  [forecastCommand.slashCommandBuilder.name, forecastCommand],
  [pollenCommand.slashCommandBuilder.name, pollenCommand],
]);

export const weather: BotModule = {
  slug:                'weather',
  name:                'Weather',
  description:         'Weather and air quality information',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked:            false,
  commands,
  defaultSettings:     { isEnabled: false },
};