import router from './router.js'
import discordClient from '../../discord/client.js'

router.get('/:guild/roles', async function(req, res) {
  try {
    const guild =
      await discordClient.guilds.fetch(req.params.guild)
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