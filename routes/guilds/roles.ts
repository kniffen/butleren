import { Request, Response } from 'express'

import router from './router'
import discordClient from '../../discord/client'

router.get('/:guild/roles', async function(req: Request, res: Response) {
  try {
    const guild =
      await discordClient.guilds
        .fetch(req.params.guild)
        .catch(err => console.error(req.method, req.originalUrl, err))

    if (!guild) return res.sendStatus(404)

    const roles =
      Array.from((await guild.roles.fetch()).values())
        .map(({ id, name }) => ({id, name}))

    res.send(roles)

  } catch (err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(500)
  }
})