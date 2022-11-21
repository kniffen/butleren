import { SlashCommandBuilder } from '@discordjs/builders'

import subCommandLatesttweet from './twitter/latesttweet.js'

const subCommands = {
  'latesttweet': subCommandLatesttweet
}

export const isLocked = false

export const data =
  new SlashCommandBuilder()
    .setName('twitter')
    .setDescription('Twitter integration')
    .addSubcommand(subcommand =>
      subcommand
        .setName('latesttweet')
        .setDescription('Latest tweet from a Twitter user')
        .addStringOption(option => 
          option
            .setName('handle')
            .setDescription('@handle for the Twitter user')
            .setRequired(true)
        )
    )

/**
 * @param {Object} interaction - Discord interaction object.
 */
export async function execute(interaction) {
  await subCommands[interaction.options.getSubcommand()](interaction)
}