import { ChannelType } from 'discord.js'

import router from './router.js'
import discordClient from '../../discord/client.js'

router.get('/:guild/channels', async function(req, res) {
  try {
    const guild =
      await discordClient.guilds
        .fetch(req.params.guild)
        .catch(err => console.error(req.method, req.originalUrl, err))
    
    if (!guild) return res.sendStatus(404)

    const channels =
      (await guild.channels.fetch())
        .filter(({ type }) => [
          ChannelType.GuildAnnouncement,
          ChannelType.GuildText
        ].includes(type))
        .map(({ id, name }) => ({id, name}))

    res.send(channels)
  } catch (err) {
    res.sendStatus(500)
    console.error(req.method, req.originalUrl, err)
  }
})