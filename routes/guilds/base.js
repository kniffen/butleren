import database from '../../database/index.js'
import router from './router.js'
import discordClient from '../../discord/client.js'

router.get('/', async function (req, res) {
  try {
    const db = await database
    const guildsData = await db.all('SELECT * FROM guilds')

    const guilds = await Promise.all(guildsData.map((guildData) =>
      discordClient.guilds
        .fetch(guildData.id)
        .catch(err => console.error(req.method, req.originalUrl, err))
    ))

    res.send(guildsData.map((guildData) => {
      const guild = guilds.find((guild) => guild?.id === guildData.id)
      
      if (!guild) return guildData

      return {
        ...guildData,
        iconURL: guild.iconURL(),
        name: guild.name
      }
    }))
  
  } catch (err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(500)
  }
})