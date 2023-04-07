import { InteractionType } from 'discord.js'

import * as modules from '../../modules/index.js'

/**
 * Handler for Discord client's interaction create event.
 * 
 * @param {Object} interaction - Discord interaction object
 * @returns {Promise<void>}
 */
export default async function onInteractionCreate(interaction) {
  if (interaction.type !== InteractionType.ApplicationCommand) return

  for (const mod of Object.values(modules)) {
    if (!mod.commands) continue
    
    const command = Object.values(mod.commands).find(cmd => cmd.data.name === interaction.commandName)

    if (command) {
      command.execute(interaction).catch(console.error)
      break
    }
  }
}