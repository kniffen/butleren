import database     from '../../database/index.js'
import router       from '../router.js'
import * as modules from '../../modules/index.js'

router.get('/api/modules/:guild', async function getAllModules(req, res) {
  try {
    const db = await database
    const dbEntries = await db.all('SELECT id, isEnabled FROM modules WHERE guildId = ?', [req.params.guild])
      
    if (dbEntries.length < 1) return res.sendStatus(404)

    const data = Object.values(modules).map(mod => {
      const dbEntry = dbEntries.find(entry => entry.id == mod.id)

      return {
        id: mod.id,
        name: mod.name,
        description: mod.description,
        commands: mod.commands ? Object.values(mod.commands).map(cmd => cmd.data) : [],
        isEnabled: !dbEntry || dbEntry.isEnabled ? true : false,
        isLocked: mod.isLocked,
      }
    })
    
    res.send(data)
    
  } catch (err) {
    console.error(req.method, req.originalUrl, err)
    res.sendStatus(500)
  }
})