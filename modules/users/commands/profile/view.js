import DiscordJS from 'discord.js'

import database from '../../../../database/index.js'

/**
 * @param {Object} interaction - Discord interaction object.
 */
export default async function viewProfile(interaction) {
  const db = await database
  const userData = await db.get('SELECT * FROM users WHERE id = ?', [interaction.user.id]).catch(console.error)
  const embed = new DiscordJS.EmbedBuilder()

  embed.setAuthor({name: `Profile for ${interaction.user.username}`})
  embed.setThumbnail(interaction.user.displayAvatarURL())
  embed.setColor('#19D8B4')
  
  embed.addFields(
    {name: 'ID',            value: interaction.user.id,            inline: true},
    {name: 'Username',      value: interaction.user.username,      inline: true},
    {name: 'Discriminator', value: interaction.user.discriminator, inline: true}
  )
  
  if (userData?.location)
    embed.addFields({name: 'Location', value: userData?.location})

  interaction.reply({
    embeds: [embed],
    ephemeral: true
  })
}