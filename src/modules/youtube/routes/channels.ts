import database from '../../../database';
import router   from './router';
import fetchYouTubeChannels from '../utils/fetchYouTubeChannels';

router.get('/:guild/channels', async function(req, res) {
  try {
    const db = await database;
    const entries = await db.all(
      'SELECT id, notificationChannelId, notificationRoleId FROM youtubeChannels WHERE guildId = ?',
      [req.params.guild]
    );
    const channels = await fetchYouTubeChannels({ids: entries.map(({ id }) => id)});

    res.send(entries.reduce((final, entry) => {
      const channel = channels.find((channel) => channel.id === entry.id);

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
      ];
    }, []));

  } catch(err) {
    console.error(req.method, req.originalUrl, err);
    res.sendStatus(500);
  }
});

router.post('/:guild/channels', async function(req, res) {
  try {
    const db = await database;

    if (
      !req.body.id ||
      !req.body.notificationChannelId ||
      !req.body.notificationRoleId
    ) {
      return res.sendStatus(400);
    }

    const existingEntry = await db.get(
      'SELECT * FROM youtubeChannels WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    );

    if (existingEntry)
      return res.sendStatus(409);

    await db.run(
      'INSERT INTO youtubeChannels (guildId, id, notificationChannelId, notificationRoleId) VALUES (?,?,?,?)',
      [req.params.guild, req.body.id, req.body.notificationChannelId, req.body.notificationRoleId]
    );

    res.sendStatus(201);

  } catch(err) {
    console.error(req.method, req.originalUrl, err);
    res.sendStatus(500);
  }
});

router.patch('/:guild/channels', async function(req, res) {
  try {
    const db = await database;
    const entry = await db.get(
      'SELECT * FROM youtubeChannels WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    );

    if (!entry)
      return res.sendStatus(404);

    const sql =
      `UPDATE youtubeChannels
       SET notificationChannelId = ?, notificationRoleId = ?
       WHERE id = ? AND guildId = ?`;

    await db.run(
      sql,
      [
        req.body.notificationChannelId || null,
        req.body.notificationRoleId || null,
        req.body.id,
        req.params.guild
      ]
    );

    res.sendStatus(200);

  } catch(err) {
    console.error(req.method, req.originalUrl, err);
    res.sendStatus(500);
  }
});

router.delete('/:guild/channels', async function(req, res) {
  try {
    const db = await database;
    const entry = await db.get(
      'SELECT * FROM youtubeChannels WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    );

    if (!entry)
      return res.sendStatus(404);

    await db.run(
      'DELETE FROM youtubeChannels WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    );

    res.sendStatus(200);

  } catch(err) {
    console.error(req.method, req.originalUrl, err);
    res.sendStatus(500);
  }
});