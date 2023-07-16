import database from '../../../database';
import router   from './router';
import fetchTwitterUsers from '../utils/fetchTwitterUsers';

router.get('/:guild/users', async function(req, res) {
  try {
    const db = await database;
    const entries = await db.all(
      'SELECT id, notificationChannelId, notificationRoleId FROM twitterUsers WHERE guildId = ?',
      [req.params.guild]
    );
    const users = await fetchTwitterUsers({ids: entries.map(({ id }) => id)});

    res.send(entries.reduce((final, entry) => {
      const user = users.find(({ id }) => id === entry.id);
      return [...final, {...entry, ...user}];
    }, []));

  } catch(err) {
    console.error(req.method, req.originalUrl, err);
    res.sendStatus(500);
  }
});

router.post('/:guild/users', async function(req, res) {
  try {
    if (
      !req.body.id ||
      !req.body.notificationChannelId ||
      !req.body.notificationRoleId
    )
      return res.sendStatus(400);


    const db = await database;

    const existingEntry = await db.get(
      'SELECT * FROM twitterUsers WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    );

    if (existingEntry)
      return res.sendStatus(409);

    await db.run(
      'INSERT INTO twitterUsers (guildId, id, notificationChannelId, notificationRoleId) VALUES (?,?,?,?)',
      [req.params.guild, req.body.id, req.body.notificationChannelId, req.body.notificationRoleId]
    );

    res.sendStatus(201);

  } catch(err) {
    console.error(req.method, req.originalUrl, err);
    res.sendStatus(500);
  }
});

router.patch('/:guild/users', async function(req, res) {
  try {
    const db = await database;
    const entry = await db.get(
      'SELECT * FROM twitterUsers WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    );

    if (!entry)
      return res.sendStatus(404);

    const sql =
      `UPDATE twitterUsers
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

router.delete('/:guild/users', async function(req, res) {
  try {
    const db = await database;
    const entry = await db.get(
      'SELECT * FROM twitterUsers WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    );

    if (!entry)
      return res.sendStatus(404);

    await db.run(
      'DELETE FROM twitterUsers WHERE guildId = ? AND id = ?',
      [req.params.guild, req.body.id]
    );

    res.sendStatus(200);

  } catch(err) {
    console.error(req.method, req.originalUrl, err);
    res.sendStatus(500);
  }
});
