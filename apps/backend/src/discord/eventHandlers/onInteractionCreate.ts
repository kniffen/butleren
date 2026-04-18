import { type Interaction, ChatInputCommandInteraction } from 'discord.js';
import { logWarn, logError } from '../../modules/logs/logger';
import { commands } from '../../modules/modules';

export const onInteractionCreate = async (interaction: Interaction): Promise<void> => {
  try {
    if (!(interaction instanceof ChatInputCommandInteraction)) {
      return;
    }

    const command = commands.get(interaction.commandName);
    if (!command) {
      logWarn('Discord', `Command "${interaction.commandName}" not found`);
      return;
    }

    await command.execute(interaction);

  } catch (err) {
    logError('Discord', 'Error during onInteractionCreate event', err);
  }
};