import database from '../../database/index.js'
import fetchSpotifyShows from './utils/fetchSpotifyShows.js'
import fetchSpotifyShowEpisodes from './utils/fetchSpotifyShowEpisodes.js'

export default async function spotifyOnInterval({ guilds, date }) {
  // This ensures that the logic will only run every hour on the hour
  // For example 12:00, 13:00, 14:00 etc...
  if (0 !== date.getMinutes() % 60) return
  
  try {
    const db = await database
    const enabledGuilds
      = (await db.all('SELECT guildId FROM modules WHERE id = ? AND isEnabled = ?', ['spotify', true]))
          .map(({ guildId}) => guildId)

    const entries =
      (await db.all('SELECT * FROM spotifyShows'))
        .filter(({ guildId }) => enabledGuilds.includes(guildId))

    const ids = entries.reduce((ids, entry) => ids.includes(entry.id) ? ids : [...ids, entry.id], [])
    const shows = await fetchSpotifyShows(ids)
    const latestEpisodes = await Promise.all(shows.map(async (show) => {
      const latestEpisode = (await fetchSpotifyShowEpisodes(show.id))?.[0]
      return {show, ...latestEpisode}
    }))

    for (const entry of entries) {
      const latestEpisode = latestEpisodes.find(({ show }) => show.id === entry.id)

      if (latestEpisode.id == entry.latestEpisodeId) continue

      const guild = guilds.find(({ id }) => id == entry.guildId)
      if (!guild) continue

      const notificationChannel = await guild.channels.fetch(entry.notificationChannelId).catch(console.error)
      if (!notificationChannel) continue
      
      await notificationChannel.send({
        content: `${entry.notificationRoleId ? `<@&${entry.notificationRoleId}> ` : ''}A new episode from ${latestEpisode.show.name} is out!\n` +
                 latestEpisode.external_urls.spotify
      }).then(() => db.run(
        'UPDATE spotifyShows SET latestEpisodeId = ? WHERE id = ? AND guildId = ?',
        [latestEpisode.id, entry.id, entry.guildId]
      )).catch(console.error)
    }

  } catch (err) {
    console.error(err)
  }
}