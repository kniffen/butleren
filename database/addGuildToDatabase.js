import database from './index.js'
import * as modules from '../modules/index.js'

/**
 * 
 * @param {Object} guild - Discord guild object 
 * @returns {Promise<void>}
 */
export default async function addGuildToDatabase(guild) {
  const db = await database

  await db.run('INSERT OR IGNORE INTO guilds (id) VALUES (?)', [guild.id])
          .catch(console.error)

  for (const mod of Object.values(modules)) {
    if (!mod.isLocked) {
      await db.run('INSERT OR IGNORE INTO modules (id, guildId) VALUES (?,?)', [mod.id, guild.id])
              .catch(console.error)
    }
  }
}