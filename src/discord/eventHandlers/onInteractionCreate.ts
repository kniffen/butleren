import { ChatInputCommandInteraction, Interaction, InteractionType } from 'discord.js';

import { modules } from '../../modules';

/**
 * Handler for Discord client's interaction create event.
 */
export default async function onInteractionCreate(interaction: Interaction) {
  if (interaction.type !== InteractionType.ApplicationCommand) return;

  for (const mod of modules) {
    if (!mod.commands) continue;

    const command = mod.commands.find(cmd => cmd.data.name === interaction.commandName);

    if (command) {
      command.execute(interaction as ChatInputCommandInteraction).catch(console.error);
      break;
    }
  }
}