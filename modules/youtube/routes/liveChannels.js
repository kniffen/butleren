import database from '../../../database/index.js'
import router   from './router.js'
import { HTTP_CODES } from '../../../database/constants.js'
import fetchYouTubeChannels from '../utils/fetchYouTubeChannels.js'

router.get('/:guild/live-channels', async function(req, res) {
  try {
    const db = await database
    const entries = await db.all(
      'SELECT id, notificationChannelId, notificationRoleId FROM youtubeLiveChannels WHERE guildId = ?',
      [req.params.guild]
    )
    const channels = await fetchYouTubeChannels({ids: entries.map(({ id }) => id)})

    res.send(entries.reduce((final, entry) => {
      const channel = channels.find(({ id }) => id === entry.id)

      return [
        ...final,
        {
          ...entry,
          name: channel?.snippet.title || '',
          description: channel?.snippet.description || '',
          url: channel?.snippet.customUrl
            ? `https://www.youtube.com/c/${channel.snippet.customUrl }`
            : `https://www.youtube.com/channel/${entry.id}`
        }
      ]
    }, []))

  } catch(err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(HTTP_CODES[err.code] || 500)
  }
})

router.post('/:guild/live-channels', async function(req, res) {
  try {
    const db = await database

    const existingEntry = await db.get(
      'SELECT * FROM youtubeLiveChannels WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    )

    if (existingEntry)
      return res.sendStatus(409)

    await db.run(
      'INSERT INTO youtubeLiveChannels (guildId, id, notificationChannelId, notificationRoleId) VALUES (?,?,?,?)',
      [req.params.guild, req.body.id, req.body.notificationChannelId, req.body.notificationRoleId]
    )

    res.sendStatus(201)

  } catch(err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(HTTP_CODES[err.code] || 500)
  }
})

router.patch('/:guild/live-channels', async function(req, res) {
  try {
    const db = await database
    const entry = await db.get(
      'SELECT * FROM youtubeLiveChannels WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    )

    if (!entry)
      return res.sendStatus(404)

    const sql =
      `UPDATE youtubeLiveChannels
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

router.delete('/:guild/live-channels', async function(req, res) {
  try {
    const db = await database
    const entry = await db.get(
      'SELECT * FROM youtubeLiveChannels WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    )

    if (!entry)
      return res.sendStatus(404)

    await db.run(
      'DELETE FROM youtubeLiveChannels WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    )

    res.sendStatus(200)

  } catch(err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(HTTP_CODES[err.code] || 500)
  }
})