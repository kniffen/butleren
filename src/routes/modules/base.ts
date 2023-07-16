import database from '../../database';
import router from './router';
import { modules } from '../../modules';

router.get('/:guild', async function getAllModules(req, res) {
  try {
    const db = await database;
    const dbEntries = await db.all('SELECT id, isEnabled FROM modules WHERE guildId = ?', [req.params.guild]);

    if (1 > dbEntries.length) return res.sendStatus(404);

    const data = modules.map(mod => {
      const dbEntry = dbEntries.find(entry => entry.id === mod.id);

      return {
        id: mod.id,
        name: mod.name,
        description: mod.description,
        commands: mod.commands ? mod.commands.map(cmd => cmd.data) : [],
        isEnabled: !!(!dbEntry || dbEntry.isEnabled),
        isLocked: mod.isLocked,
      };
    });

    res.send(data);

  } catch (err) {
    console.error(req.method, req.originalUrl, err);
    res.sendStatus(500);
  }
});