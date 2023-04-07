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
 
  try {
    await Promise.all(Object.values(modules).reduce((commandPromises, mod) => {
      if (!mod.commands) return commandPromises
      return [
        ...commandPromises,
        ...Object
          .values(mod.commands)
          .map(cmd => guild.commands.create(cmd.data.toJSON()))
      ]
    }, []))

  } catch(err) {
    console.error(err)
  }
}