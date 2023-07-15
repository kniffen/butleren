import { ChannelType, NonThreadGuildBasedChannel } from 'discord.js'
import { Request, Response } from 'express'

import router from './router'
import discordClient from '../../discord/client'

router.get('/:guild/channels', async function(req: Request, res: Response) {
  try {
    const guild =
      await discordClient.guilds
        .fetch(req.params.guild)
        .catch(err => console.error(req.method, req.originalUrl, err))

    if (!guild) return res.sendStatus(404)

    const channels =
      (await guild.channels.fetch())
        .reduce<Pick<NonThreadGuildBasedChannel, 'id' | 'name'>[]>((channels, channel) =>
          (!channel || ![ChannelType.GuildAnnouncement, ChannelType.GuildText].includes(channel.type))
            ? channels
            : [...channels, {id: channel.id, name: channel.name}]
        , [])

    res.send(channels)

  } catch (err) {
    res.sendStatus(500)
    console.error(req.method, req.originalUrl, err)
  }
})