import database from '../../database'
import fetchYouTubeActivities from './utils/fetchYouTubeActivities'

export default async function youTubeOnInterval({ guilds, date }) {
  // This ensures that the logic will only run every hour on the hour
  // For example 11:00, 12:00, 13:00 etc...
  if (0 !== date.getMinutes() % 60) return


  try {
    const db = await database
    const enabledGuilds =
      (await db.all('SELECT guildId FROM modules WHERE id = ? AND isEnabled = ?', ['youtube', true]))
        .map(({ guildId}) => guildId)

    const entries =
      (await db.all('SELECT * FROM youtubeChannels'))
        .filter(({ guildId }) => enabledGuilds.includes(guildId))

    const ids = entries.reduce((ids, entry) => ids.includes(entry.id) ? ids : [...ids, entry.id], [])
    const channelsActivities = await Promise.all(ids.map(channelId => fetchYouTubeActivities({channelId, limit: 3})))

    await Promise.all(entries.map((entry) => (async () => {
      // The youtube API has a parameter to filter out results by published date and time.
      // However it's been proven to be unreliable, so we're doing it manually here.
      const activities =
        channelsActivities
          .find((activities) => activities[0]?.snippet.channelId === entry.id)
          ?.filter(activity => 
            (3.6e+6 > date.valueOf() - (new Date(activity.snippet.publishedAt)).valueOf()) &&
            (3.6e+6 > date.valueOf() - (new Date(activity.snippet.publishedAt)).valueOf()) &&
            activity.contentDetails?.upload
          )

      if (!activities || 1 > activities.length) return

      const guild = guilds.find(({ id }) => id === entry.guildId)
      if (!guild) return

      const notificationChannel = await guild.channels.fetch(entry.notificationChannelId).catch(console.error)
      if (!notificationChannel) return

      const mention = entry.notificationRoleId ? `<@&${entry.notificationRoleId}> ` : ''
      const text = 
        1 < activities.length
          ? 'New YouTube videos were just posted'
          : activities[0].snippet.channelTitle
            ? `${activities[0].snippet.channelTitle} just posted a new YouTube video`
            : 'A new YouTube video was just posted'

      await notificationChannel.send({
        content: `${mention}${text}\n${activities.map(({ contentDetails }) => `https://www.youtube.com/watch?v=${contentDetails.upload.videoId }`).join('\n')}`
      }).catch(console.error)
    })()))

  } catch(err) {
    console.error(err)
  }
}