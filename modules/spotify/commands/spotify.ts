import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import { latestEpisodeSubCommand } from './spotify/latestepisode';

const subCommands: Record<string, (interaction: ChatInputCommandInteraction) => void> = {
  'latestepisode': latestEpisodeSubCommand
};

const data =
  new SlashCommandBuilder()
    .setName('spotify')
    .setDescription('Spotify integration')
    .addSubcommand(subcommand =>
      subcommand
        .setName('latestepisode')
        .setDescription('Latest episode for a Spotify show')
        .addStringOption(option =>
          option
            .setName('show')
            .setDescription('Name of the show')
            .setRequired(true)
        )
    );


const execute = async (interaction: ChatInputCommandInteraction) => {
  const cmd = interaction.options.getSubcommand();
  await subCommands[cmd](interaction);
};

export const spotifyCommand: BotCommand = {
  isLocked: false,
  data,
  execute
};