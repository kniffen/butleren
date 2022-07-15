import DiscordJS from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

import database from '../../../database/index.js'

export const isLocked = true

export const data =
  new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View your profile')

/**
 * @param {Object} interaction - Discord interaction object.
 */
export async function execute(interaction) {
  const db = await database
  const userData = await db.get('SELECT * FROM users WHERE id = ?', [interaction.user.id]).catch(console.error)
  const embed = new DiscordJS.MessageEmbed()

  embed.setAuthor({name: `Profile for ${interaction.user.username}`})
  embed.setThumbnail(interaction.user.displayAvatarURL())
  embed.setColor('#19D8B4')
  
  embed.addField('ID', interaction.user.id, true)
  embed.addField('Username', interaction.user.username, true)
  embed.addField('Discriminator', interaction.user.discriminator, true)
  
  if (userData?.location)
    embed.addField('Location', userData?.location)

  interaction.reply({
    embeds: [embed],
    ephemeral: true
  })
}