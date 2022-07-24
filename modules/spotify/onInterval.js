import database from '../../database/index.js'
import fetchSpotifyShowEpisodes from './utils/fetchSpotifyShowEpisodes.js'

export default async function spotifyOnInterval({ guilds, date }) {
  // This ensures that the logic will only run every hour on the hour
  // For example 12:00, 13:00, 14:00 etc...
  if (0 !== date.getMinutes() % 60) return
  
  try {
    const db      = await database
    const entries = await db.all('SELECT * FROM spotifyShows')

    // Fetching all episodes based on show id first to ensure that a show is not looked up more than once
    // This might happen as guilds can have the some of the same shows
    const shows = await entries.reduce(async function(showsPromise, entry) {
      const shows = await showsPromise
      if (shows.find(({ id }) => id === entry.id)) return shows
      return [...shows, {id: entry.id, latestEpisode: (await fetchSpotifyShowEpisodes(entry.id))?.[0]}]
    }, Promise.resolve([]))

    for (const entry of entries) {
      const show = shows.find(({ id }) => id === entry.id)

      if (show.latestEpisode.id == entry.latestEpisodeId) continue

      const guild = guilds.find(({ id }) => id == entry.guildId)
      if (!guild) continue

      const notificationChannel = await guild.channels.fetch(entry.notificationChannelId).catch(console.error)
      if (!notificationChannel) continue
      
      await notificationChannel.send({
        content: `${entry.notificationRoleId ? `<@&${entry.notificationRoleId}> ` : ''}A new episode from ${show.latestEpisode.show.name} is out!\n` +
                 show.latestEpisode.external_urls.spotify
      })

      await db.run(
        'UPDATE spotifyShows SET latestEpisodeId = ? WHERE id = ? AND guildId = ?',
        [show.latestEpisode.id, entry.id, entry.guildId]
      )
    }

  } catch (err) {
    console.error(err)
  }
}