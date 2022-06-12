import database from '../../database/index.js'
import * as modules from '../../modules/index.js'

/**
 * Handler for the Discord client's guildCreate event.
 * 
 * @param {Object} guild - Discord guild object.
 * @returns {Promise<void>}
 */
export default async function onGuildCreate(guild) {
  const db = await database
  
  await db.run('INSERT OR IGNORE INTO guilds (id) VALUES (?)', [guild.id])
          .catch(console.error)

  for (const mod of Object.values(modules)) {
    if (!mod.isLocked) {
      await db.run('INSERT OR IGNORE INTO modules (id, guildId) VALUES (?,?)', [mod.id, guild.id])
              .catch(console.error)
    }

    if (mod.commands) {
      await Promise.all(Object.values(mod.commands).map(cmd => guild.commands.create(cmd.data.toJSON())))
                   .catch(console.error)
    }
  }
}