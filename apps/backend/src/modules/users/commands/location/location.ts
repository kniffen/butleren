import type { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { BotCommand } from '../../../../types';
import { locationClearCommand } from './subCommands/locationClearCommand';
import { locationSetCommand } from './subCommands/locationSetCommand';
import { locationViewCommand } from './subCommands/locationViewCommand';

const slashCommandBuilder =
  new SlashCommandBuilder()
    .setName('location')
    .setDescription('Manage your location')
    .addSubcommand(subCommand =>
      subCommand
        .setName('view')
        .setDescription('View your current location')
    )
    .addSubcommand(subCommand =>
      subCommand
        .setName('set')
        .setDescription('Set your location')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Set your location using a city or town name')
        )
        .addStringOption(option =>
          option
            .setName('zip')
            .setDescription('Set your location using ZIP code (US only)')
        )
    )
    .addSubcommand(subCommand =>
      subCommand
        .setName('clear')
        .setDescription('Clear your current location')
    );

const subCommands: Record<string, (commandInteraction: ChatInputCommandInteraction) => Promise<void> | undefined> = {
  clear: locationClearCommand,
  set:   locationSetCommand,
  view:  locationViewCommand,
};

const execute = async (commandInteraction: ChatInputCommandInteraction): Promise<void> => {
  const subCommand = subCommands[commandInteraction.options.getSubcommand()];

  if (!subCommand) {
    throw new Error('Subcommand not found');
  }

  await subCommand(commandInteraction);
};

export const locationCommand: BotCommand = {
  isLocked:        true,
  slashCommandBuilder,
  execute,
  defaultSettings: { isEnabled: true },
  parentSlug:      'users',
};