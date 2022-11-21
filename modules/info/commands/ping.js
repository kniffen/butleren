import { SlashCommandBuilder } from '@discordjs/builders'

export const isLocked = true
export const data =
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Latency check')

/**
 * @param {Object} interaction - Discord interaction object.
 */
export async function execute(interaction) {
  await interaction.reply('pong!')
}
