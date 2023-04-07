import database from '../../database/index.js'
import client from '../../discord/client.js'
import router from './router.js'
import * as modules from '../../modules/index.js'

router.get('/:guild/:module', async function getModule(req, res) {
  const handleError = (err) => console.error(req.method, req.originalUrl, err)
  
  try {
    const guild = await client.guilds.fetch(req.params.guild).catch(handleError)
    if (!guild) return res.sendStatus(404)

    const mod = Object.values(modules).find(mod => mod.id === req.params.module)
    if (!mod) return res.sendStatus(404)

    const db = await database

    const entry = await db.get(
      'SELECT isEnabled FROM modules WHERE id = ? AND guildId = ?',
      [mod.id, guild.id]
    ).catch(handleError)

    const data = {
      id: mod.id,
      name: mod.name,
      description: mod.description,
      isEnabled: !!(!entry || entry.isEnabled),
      isLocked: !entry,
    }

    res.send(data)
    
  } catch (err) {
    handleError(err)
    res.sendStatus(500)
  }
})

router.put('/:guild/:module', async function putModule(req, res) {
  const handleError = (err) => console.error(req.method, req.originalUrl, err)
  
  try {
    const guild = await client.guilds.fetch(req.params.guild).catch(handleError)
    if (!guild) return res.sendStatus(404)

    const db = await database
  
    const settings = await db.get(
      'SELECT * FROM modules WHERE guildId = ? AND id = ?',
      [req.params.guild, req.params.module]
    )

    if (!settings) return res.sendStatus(404)

    // disable or enable all commands associated with the module
    if (Object.hasOwn(req.body, 'isEnabled')) {
      const mod = Object.values(modules).find(mod => mod.id === req.params.module)
      const moduleCommands = mod.commands ? Object.values(mod.commands) : []
      const guildCommands = 
        await guild.commands.fetch()
          .then(gc => gc.filter(gc => moduleCommands.find(c => gc.name === c.data.name)))
          .catch(handleError)

      if (!req.body.isEnabled) {
        await Promise.all(guildCommands.map(cmd => guild.commands.delete(cmd))).catch(handleError)
      } else {
        await Promise.all(moduleCommands.map(cmd => guild.commands.create(cmd.data.toJSON()))).catch(handleError)
      }
    }    

    const entries = Object.entries(req.body).filter(([ key]) => !['id', 'guildId'].includes(key))
    
    const sqlStr = `UPDATE modules
      ${entries.map(([ key, value ]) => `SET ${key} = ${'string' === typeof value ? `"${value}"`: value}`).join(',')}
      WHERE guildId = ? AND id = ?`

    await db.run(sqlStr, [req.params.guild, req.params.module])
    res.sendStatus(200)

  } catch(err) {
    handleError(err)
    res.sendStatus(500)
  }
})