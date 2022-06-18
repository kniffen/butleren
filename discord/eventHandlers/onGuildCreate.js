import addGuildToDatabase from '../../database/addGuildToDatabase.js'
import * as modules from '../../modules/index.js'

/**
 * Handler for the Discord client's guildCreate event.
 * 
 * @param {Object} guild - Discord guild object.
 * @returns {Promise<void>}
 */
export default async function onGuildCreate(guild) {
  await addGuildToDatabase(guild)
  
  for (const mod of Object.values(modules)) {
    if (mod.commands) {
      await Promise.all(Object.values(mod.commands).map(cmd => guild.commands.create(cmd.data.toJSON())))
                   .catch(console.error)
    }
  }
}