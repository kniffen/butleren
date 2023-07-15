import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

import subCommandStatus from './truckersmp/status';
import { BotCommand } from '../../../types/butleren';

const subCommands: Record<string, (interaction: ChatInputCommandInteraction) => Awaited<void>> = {
  'status': subCommandStatus
};

const data =
  new SlashCommandBuilder()
    .setName('truckersmp')
    .setDescription('TruckersMP integration')
    .addSubcommand(subcommand =>
      subcommand
        .setName('status')
        .setDescription('Get the current status of TruckersMP servers')
    );

const execute = async (interaction: ChatInputCommandInteraction) => {
  await subCommands[interaction.options.getSubcommand()](interaction);
};

export const truckersMPCommand: BotCommand = {
  isLocked: false,
  execute,
  data
};
