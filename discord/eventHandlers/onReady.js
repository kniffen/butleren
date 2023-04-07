import addGuildToDatabase from '../../database/addGuildToDatabase.js'
import * as modules from '../../modules/index.js'

const commands = Object.values(modules).reduce((commands, mod) => 
  mod.commands ? [...commands, ...Object.values(mod.commands)] : commands
, [])


/**
 * Handler for the Discord client's ready event.
 * 
 * @param {Object} client - Discord client.
 */
export default async function onReady(client) {
  client.user.setActivity(process.env.npm_package_version)

  console.log('Discord: Client is ready.')

  const guilds = await client.guilds.fetch().catch(console.error)
  if (!guilds) return

  guilds.forEach(async ({ id }) => {
    const guild         = await client.guilds.fetch(id).catch(console.error)
    const guildCommands = await guild.commands.fetch().catch(console.error)

    await addGuildToDatabase(guild)

    commands.forEach(command => {
      const guildCommand = guildCommands.find(guildCommand => command.data.name === guildCommand.name)
  
      // In case a new locked command was added to the bot
      // we add it to the guild
      if (!guildCommand && command.isLocked) {
        guild.commands.create(command.data.toJSON()).catch(console.error)

      // Update existing guild commands in case the command data was updated
      } else if (guildCommand) {
        guild.commands.edit(guildCommand, command.data.toJSON()).catch(console.error)
      }
    })

    // In case a command was removed from the bot
    // we delete it from the guild
    guildCommands.forEach(guildCommand => {
      const command = commands.find(cmd => cmd.data.name === guildCommand.name)
    
      if (!command)
        guild.commands.delete(guildCommand).catch(console.error)
    })
  })
}