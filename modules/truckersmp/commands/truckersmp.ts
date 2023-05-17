import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

import subCommandStatus from './truckersmp/status';

const subCommands: Record<string, (interaction: ChatInputCommandInteraction) => Awaited<void>> = {
  'status': subCommandStatus
};

export const isLocked = false;

export const data =
  new SlashCommandBuilder()
    .setName('truckersmp')
    .setDescription('TruckersMP integration')
    .addSubcommand(subcommand =>
      subcommand
        .setName('status')
        .setDescription('Get the current status of TruckersMP servers')
    );

/**
 * @param {Object} interaction - Discord interaction object.
 */
export async function execute(interaction: ChatInputCommandInteraction) {
  await subCommands[interaction.options.getSubcommand()](interaction);
}