import database from '../../database/index.js'
import router from './router.js'
import discordClient from '../../discord/client.js'

router.get('/', async function (req, res) {
  try {
    const db = await database
    const guildsData = await db.all('SELECT * FROM guilds')

    for (const guildData of guildsData) {
      const guild =
        await discordClient.guilds.fetch(guildData.id)
                                  .catch(err => console.error(req.method, req.originalUrl, err))

      if (!guild) continue
    
      guildData.iconURL = guild.iconURL()
      guildData.name = guild.name
    }

    res.send(guildsData)
  
  } catch (err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(500)
  }
})