import database from '../../../database/index.js'
import router   from '../../../routes/router.js'
import { HTTP_CODES } from '../../../database/constants.js'

import fetchSpotifyShows from '../utils/fetchSpotifyShows.js'

const path = '/api/spotify/:guild/shows'

router.get(path, async function getModule(req, res) {
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

router.post(path, async function getModule(req, res) {
  try {
    const db = await database

    const existingEntry = await db.get(
      'SELECT * FROM spotifyShows WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    )

    if (existingEntry)
      return res.sendStatus(409)

    await db.run(
      'INSERT INTO spotifyShows (guildId, id, notificationChannelId, notificationRoleId) VALUES (?,?,?,?)',
      [req.params.guild, req.body.id, req.body.notificationChannelId, req.body.notificationRoleId]
    )

    res.sendStatus(201)

  } catch(err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(HTTP_CODES[err.code] || 500)
  }
})

router.patch(path, async function getModule(req, res) {
  try {
    const db = await database
    const entry = await db.get(
      'SELECT * FROM spotifyShows WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    )

    if (!entry)
      return res.sendStatus(404)

    await Promise.all(Object
      .entries(req.body)
      .filter(([key]) => !['id', 'guildId'].includes(key))
      .map(([key, value]) => db.run(
        `UPDATE spotifyShows SET ${key} = ? WHERE guildId = ? AND id = ?`,
        [value, req.params.guild, req.body.id]
      ))
    )

    res.sendStatus(200)

  } catch(err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(HTTP_CODES[err.code] || 500)
  }
})

router.delete(path, async function getModule(req, res) {
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