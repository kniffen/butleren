import type { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { BotCommand } from '../../../types';

const slashCommandBuilder =
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Latency check');

const execute = async (commandInteraction: ChatInputCommandInteraction): Promise<void> => {
  await commandInteraction.reply('Pong!');
};

export const pingCommand: BotCommand = {
  isLocked:        true,
  slashCommandBuilder,
  execute,
  defaultSettings: { isEnabled: true },
  parentSlug:      'core',
};