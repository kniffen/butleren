import database from '../../database/index.js'
import fetchYouTubeActivities from './utils/fetchYouTubeActivities.js'

export default async function youTubeOnInterval({ guilds, date }) {
  // This ensures that the logic will only run every hour on the hour
  // For example 11:00, 12:00, 13:00 etc...
  if (0 !== date.getMinutes() % 60) return
  
  try {
    const db = await database
    const enabledGuilds
      = (await db.all('SELECT guildId FROM modules WHERE id = ? AND isEnabled = ?', ['youtube', true]))
          .map(({ guildId}) => guildId)
    
    const entries =
      (await db.all('SELECT * FROM youtubeChannels'))
        .filter(({ guildId }) => enabledGuilds.includes(guildId))

    const ids = entries.reduce((ids, entry) => ids.includes(entry.id) ? ids : [...ids, entry.id], [])
    const channelsActivities = await Promise.all(ids.map(channelId => fetchYouTubeActivities({
      channelId,
      publishedAfter: (new Date(date.valueOf() - 3.6e+6)).toISOString().replace(/\d{2}:\d{2}\.\d*/, '00:00.000')
    })))

    for (const entry of entries) {
      const activities = channelsActivities.find((activities) => activities[0]?.snippet.channelId === entry.id)
      if (!activities || 1 > activities.length) continue

      const guild = guilds.find(({ id }) => id == entry.guildId)
      if (!guild) continue

      const notificationChannel = await guild.channels.fetch(entry.notificationChannelId).catch(console.error)
      if (!notificationChannel) continue

      await Promise.all(activities.map(({ snippet, contentDetails }) => notificationChannel.send({
        content:
          `${entry.notificationRoleId 
            ? `<@&${entry.notificationRoleId}> `
            : ''}${snippet.channelTitle} just posted a new YouTube video\nhttps://www.youtube.com/watch?v=${contentDetails.upload.videoId}`
      }))).catch(console.error)
    }

  } catch(err) {
    console.error(err)
  }
}