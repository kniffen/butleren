import database from '../../../database/index.js'
import router   from '../../../routes/router.js'
import { HTTP_CODES } from '../../../database/constants.js'

import fetchSpotifyShows from '../utils/fetchSpotifyShows.js'
import fetchSpotifyShowEpisodes from '../utils/fetchSpotifyShowEpisodes.js'

const path = '/api/spotify/:guild/shows'

router.get(path, async function(req, res) {
  try {
    const db = await database
    const entries = await db.all(
      'SELECT id, notificationChannelId, notificationRoleId FROM spotifyShows WHERE guildId = ?',
      [req.params.guild]
    )

    const showIds = entries.reduce((ids, entry) => ids.includes(entry.id) ? ids : [...ids, entry.id], [])
    const shows = await fetchSpotifyShows(showIds)

    return res.send(shows.map((show) => {
      const entry = entries.find(({ id }) => id == show.id)
  
      return {
        id:          show.id,
        name:        show.name,
        publisher:   show.publisher,
        description: show.description,
        url:         show.external_urls.spotify,
        ...entry
      }
    }))

  } catch(err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(HTTP_CODES[err.code] || 500)
  }
})

router.post(path, async function(req, res) {
  try {
    const db = await database

    const existingEntry = await db.get(
      'SELECT * FROM spotifyShows WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    )

    if (existingEntry)
      return res.sendStatus(409)

    const episodes = await fetchSpotifyShowEpisodes(req.body.id)
    
    await db.run(
      'INSERT INTO spotifyShows (guildId, id, latestEpisodeId, notificationChannelId, notificationRoleId) VALUES (?,?,?,?,?)',
      [req.params.guild, req.body.id, episodes[0]?.id || null, req.body.notificationChannelId, req.body.notificationRoleId]
    )

    res.sendStatus(201)

  } catch(err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(HTTP_CODES[err.code] || 500)
  }
})

router.patch(path, async function(req, res) {
  try {
    const db = await database
    const entry = await db.get(
      'SELECT * FROM spotifyShows WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    )

    if (!entry)
      return res.sendStatus(404)
    
    const sql = 
      `UPDATE spotifyShows
       SET notificationChannelId = ?, notificationRoleId = ?
       WHERE id = ? AND guildId = ?`
    
    await db.run(
      sql,
      [
        req.body.notificationChannelId || null,
        req.body.notificationRoleId || null,
        req.body.id,
        req.params.guild
      ]
    )

    res.sendStatus(200)

  } catch(err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(HTTP_CODES[err.code] || 500)
  }
})

router.delete(path, async function(req, res) {
  try {
    const db = await database

    const entry = await db.get(
      'SELECT * FROM spotifyShows WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    )

    if (!entry)
      return res.sendStatus(404)

    await db.run(
      'DELETE FROM spotifyShows WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    )

    res.sendStatus(200)

  } catch(err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(HTTP_CODES[err.code] || 500)
  }
})