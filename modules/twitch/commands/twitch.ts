import DiscordJS, { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import subCommandStream from './twitch/stream';
import subCommandSchedule from './twitch/schedule';

const subCommands: Record<string, (interaction: ChatInputCommandInteraction) => Promise<DiscordJS.Message<boolean> | undefined>> = {
  'stream': subCommandStream,
  'schedule': subCommandSchedule,
};

export const isLocked = false;

export const data =
  new SlashCommandBuilder()
    .setName('twitch')
    .setDescription('Twitch integration')
    .addSubcommand(subcommand =>
      subcommand
        .setName('stream')
        .setDescription('Information about a Twitch stream')
        .addStringOption(option =>
          option
            .setName('channel')
            .setDescription('Name of the channel')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('schedule')
        .setDescription('Schedule for a Twitch channel')
        .addStringOption(option =>
          option
            .setName('channel')
            .setDescription('Name of the channel')
            .setRequired(true)
        )
    );

/**
 * @param {Object} interaction - Discord interaction object.
 */
export async function execute(interaction: ChatInputCommandInteraction) {
  await subCommands[interaction.options.getSubcommand()](interaction);
}