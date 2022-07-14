import discordClient from '../../discord/client.js'
import * as modules from '../../modules/index.js'
import router from '../router.js'

router.get('/api/commands/:guild', async function(req, res) {
  const handleError = (err) => console.error(req.method, req.originalUrl, err)

  try {
    const guild = await discordClient.guilds.fetch(req.params.guild).catch(handleError)
    if (!guild) return res.sendStatus(404)

    const guildCommands = await guild.commands.fetch().catch(handleError)
    if (!guildCommands) return res.sendStatus(404)

    const commands = Object.entries(modules).reduce(function(commands, [ modId, mod ]) {
      if (!mod.commands) return commands

      return [
        ...commands,
        ...Object.entries(mod.commands)
                 .map(([ id, cmd ]) => ({
                    id,
                    name: cmd.data.name,
                    description: cmd.data.description,
                    isEnabled: guildCommands.find(c => c.name == cmd.data.name) ? true : false,
                    isLocked: cmd.isLocked,
                    module: {
                      id: modId,
                      name: mod.name
                    }
                 }))
      ]
    }, [])

    res.send(commands)
  
  } catch(err) {
    handleError(err)
    res.sendStatus(500)
  }
})
