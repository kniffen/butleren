import database from '../../../database/index.js'
import router   from '../../../routes/router.js'
import { HTTP_CODES } from '../../../database/constants.js'

import fetchTwitchUsers from '../utils/fetchTwitchUsers.js'

const path = '/api/twitch/:guild/channels'

router.get(path, async function(req, res) {
  try {
    const db = await database
    const entries = await db.all(
      'SELECT id, notificationChannelId, notificationRoleId FROM twitchChannels WHERE guildId = ?',
      [req.params.guild]
    )

    const ids = entries.map(({ id }) => id)
    const users = await fetchTwitchUsers({ids})

    return res.send(entries.map((entry) => {
      const user = users.find(({ id }) => id === entry.id)
      return {
        ...entry,
        name:        user?.display_name || '',
        description: user?.description || '',
        url:         `https://www.twitch.tv/${user?.login || ''}`
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
      'SELECT * FROM twitchChannels WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    )

    if (existingEntry)
      return res.sendStatus(409)

    await db.run(
      'INSERT INTO twitchChannels (guildId, id, notificationChannelId, notificationRoleId) VALUES (?,?,?,?)',
      [req.params.guild, req.body.id, req.body.notificationChannelId, req.body.notificationRoleId]
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
      'SELECT * FROM twitchChannels WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    )

    if (!entry)
      return res.sendStatus(404)
    
    const sql = 
      `UPDATE twitchChannels
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
      'SELECT * FROM twitchChannels WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    )

    if (!entry)
      return res.sendStatus(404)

    await db.run(
      'DELETE FROM twitchChannels WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    )

    res.sendStatus(200)

  } catch(err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(HTTP_CODES[err.code] || 500)
  }
})