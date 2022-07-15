import { SlashCommandBuilder } from '@discordjs/builders'

import database from '../../../database/index.js'

export const isLocked = true

export const data =
  new SlashCommandBuilder()
    .setName('setlocation')
    .setDescription('Set your location')
    .addStringOption(option =>
      option
        .setName('location')
        .setDescription('Your location name or zip code')
        .setRequired(true)
    )

/**
 * @param {Object} interaction - Discord interaction object.
 */
export async function execute(interaction) {
  let content = 'Sorry, I was unable to set your location.'

  try {
    const db = await database
    const userData = await db.get('SELECT location FROM users WHERE id = ?', [interaction.user.id])
    const location = interaction.options.get('location')?.value

    if (!userData) {
      await db.run('INSERT INTO users (location, id) VALUES (?,?)', location, interaction.user.id)
    } else {
      await db.run('UPDATE users SET location = ? WHERE id = ?', location, interaction.user.id)
    }

    content = `Your location is now set to \`${location}\`\nType \`/profile\` to view your updated profile.`

  } catch (err) { console.error(err) }

  interaction.reply({content, ephemeral: true})
}