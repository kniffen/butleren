import DiscordJS from 'discord.js'

import database from '../../database/index.js'
import fetchTwitchStreams from './utils/fetchTwitchStreams.js'

/**
 * 
 * @param {Object}   param
 * @param {Object[]} param.guilds - Discord.js guild objects.
 * @param {Object}   param.date - JS date object for the current date and time.
 * @returns Void
 */
export default async function twitchOnInterval({ guilds, date }) {
  // This ensures that the logic will only run every 5 min, on the 5 min mark
  // For example 12:00, 12:05, 12:10 etc...
  if (0 !== date.getMinutes() % 5) return

  try {
    const db = await database
    const enabledGuilds =
      (await db.all('SELECT guildId FROM modules WHERE id = ? AND isEnabled = ?', ['twitch', true]))
        .map(({ guildId}) => guildId)

    const entries =
      (await db.all('SELECT * FROM twitchChannels'))
        .filter(({ guildId }) => enabledGuilds.includes(guildId))

    const ids = entries.reduce((ids, entry) => ids.includes(entry.id) ? ids : [...ids, entry.id], [])
    const streams = await fetchTwitchStreams({ids})

    for (const entry of entries) {
      const stream = streams.find(({user_id}) => user_id === entry.id)
      if (!stream) continue

      if (300000 < date.valueOf() - (new Date(stream.started_at)).valueOf())
        continue

      const guild = guilds.find(({ id }) => id === entry.guildId)
      if (!guild) continue

      const notificationChannel = await guild.channels.fetch(entry.notificationChannelId).catch(console.error)
      if (!notificationChannel) continue

      const embed = new DiscordJS.EmbedBuilder()

      embed.setTitle(`${stream.user_name} is streaming on Twitch`)
      embed.setURL(`https://twitch.tv/${stream.user_login}`)
      embed.setColor('#9146FF') // Twitch purple
      embed.setDescription(`**${stream.title}**`)
      embed.setImage(`${stream.thumbnail_url.replace('{width}', 400).replace('{height}', 225)}?t=${date.valueOf()}`)
      embed.addFields({
        name:  'Category',
        value: stream.game_name || 'Unknown'
      })

      notificationChannel.send({
        content: `${entry.notificationRoleId ? `<@&${entry.notificationRoleId}> ` : ''}${stream.user_name} is live!`,
        embeds: [embed]
      }).catch(console.error)
    }
 
  } catch(err) {
    console.error(err)
  }
}