import { SlashCommandBuilder } from '@discordjs/builders'

export const isLocked = false
export const data =
  new SlashCommandBuilder()
    .setName('throw')
    .setDescription('Throws things!')
    .addStringOption(option =>
        option
          .setName('item')
          .setDescription('item to throw')
          .setRequired(true)
    )

/**
 * @param {Object} param 
 * @param {Object} param.interaction - Discord interaction object .
 */
export async function execute(interaction) {
  await interaction.reply({content: `(╯°□°）╯︵ ${interaction.options.get('item').value}`})
}
