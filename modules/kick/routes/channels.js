import database from '../../../database/index.js'
import { router }   from './router.js'
import { HTTP_CODES } from '../../../database/constants.js'
import { getKickChannels } from '../utils/getKickChannels.js';

router.get('/:guild/channels', async function(req, res) {
  try {
    const db = await database
    const entries = await db.all(
      'SELECT broadcasterUserId, notificationChannelId, notificationRoleId FROM kickChannels WHERE guildId = ?',
      [req.params.guild]
    )

    const broadcasterUserIds = entries.map(({ broadcasterUserId }) => broadcasterUserId)
    const channels = await getKickChannels({broadcasterUserIds})

    return res.send(entries.map((entry) => {
      const channel = channels.find(({ broadcaster_user_id }) => broadcaster_user_id.toString() === entry.broadcasterUserId)
      return {
        ...entry,
        name:        channel?.slug || '',
        description: channel?.channel_description || '',
        url:         `https://www.kick.com/${channel?.slug || ''}`
      }
    }))

  } catch(err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(HTTP_CODES[err.code] || 500)
  }
})

router.post('/:guild/channels', async function(req, res) {
  try {
    const db = await database

    const existingEntry = await db.get(
      'SELECT * FROM kickChannels WHERE guildId = ? AND broadcasterUserId = ?',
      [req.params.guild, req.body.broadcasterUserId]
    )

    if (existingEntry)
      return res.sendStatus(409);

    await db.run(
      'INSERT INTO kickChannels (guildId, broadcasterUserId, notificationChannelId, notificationRoleId) VALUES (?,?,?,?)',
      [req.params.guild, req.body.broadcasterUserId, req.body.notificationChannelId, req.body.notificationRoleId]
    )

    res.sendStatus(201)

  } catch(err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(HTTP_CODES[err.code] || 500)
  }
})

router.patch('/:guild/channels', async function(req, res) {
  try {
    const db = await database
    const entry = await db.get(
      'SELECT * FROM kickChannels WHERE guildId = ? AND broadcasterUserId = ?',
      [req.params.guild, req.body.broadcasterUserId]
    )

    if (!entry)
      return res.sendStatus(404)

    const sql =
      `UPDATE kickChannels
       SET notificationChannelId = ?, notificationRoleId = ?
       WHERE broadcasterUserId = ? AND guildId = ?`

    await db.run(
      sql,
      [
        req.body.notificationChannelId || null,
        req.body.notificationRoleId || null,
        req.body.broadcasterUserId,
        req.params.guild
      ]
    )

    res.sendStatus(200)

  } catch(err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(HTTP_CODES[err.code] || 500)
  }
})

router.delete('/:guild/channels', async function(req, res) {
  try {
    const db = await database

    const entry = await db.get(
      'SELECT * FROM kickChannels WHERE guildId = ? AND broadcasterUserId = ?',
      [req.params.guild, req.body.id]
    )

    if (!entry)
      return res.sendStatus(404)

    await db.run(
      'DELETE FROM kickChannels WHERE guildId = ? AND broadcasterUserId = ?',
      [req.params.guild, req.body.id]
    )

    res.sendStatus(200)

  } catch(err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(HTTP_CODES[err.code] || 500)
  }
})