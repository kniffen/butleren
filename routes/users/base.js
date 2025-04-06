import discordClient from '../../discord/client.js'
import database from '../../database/index.js'
import router from './router.js'

router.get('/', async function (req, res) {
  try {
    const db = await database
    const usersData = await db.all('SELECT * FROM users')

    const responseBody = await Promise.all(usersData.map(async (user) => {
      const discordUser = await discordClient.users.fetch(user.id)

      return {
        ...user,
        username: discordUser?.username || 'UNKNOWN'
      }
    }));

    res.send(responseBody)

  } catch (err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(500)
  }
})