import database from '../../database/index.js'

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
}