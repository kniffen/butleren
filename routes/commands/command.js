import database      from '../../database/index.js'
import discordClient from '../../discord/client.js'
import * as modules  from '../../modules/index.js'
import router        from '../router.js'

const path = '/api/commands/:guild/:module/:command'

router.put(path, async function(req, res) {
  try {
    if (!req.body.hasOwnProperty('isEnabled')) return res.sendStatus(400)

    const handleError = (err) => console.error(req.method, req.originalUrl, err)
    
    const guild = await discordClient.guilds.fetch(req.params.guild).catch(handleError)
    const commands = Object.values(modules).reduce((commands, mod) => {
      if (!mod.commands) return commands
      return [...commands, ...Object.values(mod.commands).map(cmd => ({...cmd, mod}))]
    }, [])
    const command = commands.find(cmd => cmd.data.name === req.params.command)
    
    if (!guild || !command) return res.sendStatus(404)

    const guildCommands = await guild.commands.fetch()

    if (!req.body.isEnabled) {
      const guildCommand = guildCommands.find(guildCmd => guildCmd.name == command.data.name)
      
      guild.commands
        .delete(guildCommand)
        .then(() => {
          console.log('command disabled')
          res.sendStatus(200)
        })

    } else {
      const db = await database

      // Here we enable the module if it's disabled 
      await db.get(
        'SELECT isEnabled FROM modules WHERE id = ? AND guildId = ?',
        [command.mod.id, guild.id]
      ).then(async modSettings => {
        if (!modSettings.isEnabled) {
         await db.run(
            'UPDATE modules SET isEnabled = 1 WHERE id = ? AND guildId = ?',
            [command.mod.id, guild.id]
          )
        }
      })

      const applicationCommand = await guild.commands.create(command.data.toJSON()).catch(handleError)
      if (!applicationCommand) return res.sendStatus(500)
      
      res.sendStatus(200)
    }

  } catch(err) {
    console.error(err)
    res.sendStatus(500)
  }
})