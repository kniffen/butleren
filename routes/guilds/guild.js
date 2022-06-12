import database      from '../../database/index.js'
import router        from '../router.js'
import discordClient from '../../discord/client.js'

router.get('/api/guilds/:guild', async function(req, res) {
  try {
    const guild =
      await discordClient.guilds.fetch(req.params.guild)
                                .catch(err => console.error(req.method, req.originalUrl, err))
    
    if (!guild) return res.sendStatus(404)

    const db        = await database
    const guildData = await db.get('SELECT * FROM guilds WHERE id = ?', [guild.id])
    const channels  = Array.from((await guild.channels.fetch()).values())
    const roles     = await guild.roles.fetch()

    guildData.name = guild.name
    guildData.iconURL = guild.iconURL()
    guildData.categories = channels.filter(channel => 'GUILD_CATEGORY' == channel.type)?.length || 0
    guildData.textChannels = channels.filter(channel => 'GUILD_TEXT' == channel.type)?.length || 0
    guildData.voiceChannels = channels.filter(channel => 'GUILD_VOICE' == channel.type)?.length || 0
    guildData.roles = roles.size

    res.send(guildData)
  
  } catch (err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(500)
  }
})

router.put('/api/guilds/:guild', async function(req, res) {
  try {
    const guild =
      await discordClient.guilds.fetch(req.params.guild)
                                .catch(err => console.error(req.method, req.originalUrl, err))

    if (!guild) return res.sendStatus(404)

    const member =
      await guild.members.fetch(discordClient.user.id)
                         .catch(err => console.error(req.method, req.originalUrl, err))

    if (!member) return res.sendStatus(404)

    const db = await database

    for (const key in req.body) {
      await db.run(`UPDATE guilds SET ${key} = ? WHERE id = ?`, [req.body[key] || null, guild.id])

      if ('nickname' == key)
        member.setNickname(req.body[key] || null)
    }

    res.sendStatus(200)
  
  } catch (err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(500)
  }
})
