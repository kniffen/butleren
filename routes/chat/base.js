import { ChannelType } from 'discord.js'

import router from './router.js'
import discordClient from '../../discord/client.js'

router.post('/', async function(req, res) {
  try {
    const channel = await discordClient.channels.fetch(req.body.channel);
    if (!channel || channel.type !== ChannelType.GuildText) {
      return res.sendStatus(400);
    }

    channel.send(req.body.message)

  } catch(err) {
    console.error(req.method, req.originalUrl, err);
    res.sendStatus(500);
  }

})