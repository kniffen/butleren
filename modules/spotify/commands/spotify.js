import { SlashCommandBuilder } from '@discordjs/builders'

import subCommandLatestepisode from './spotify/latestepisode.js'

const subCommands = {
  'latestepisode': subCommandLatestepisode
}

export const isLocked = false

export const data =
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
    )

/**
 * @param {Object} interaction - Discord interaction object.
 */
export async function execute(interaction) {
  await subCommands[interaction.options.getSubcommand()](interaction)
}