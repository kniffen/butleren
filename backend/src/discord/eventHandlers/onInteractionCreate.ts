import { type Interaction, InteractionType } from 'discord.js';
import { logWarn, logError } from '../../logger/logger';
import { commands } from '../../modules/modules';

export const onInteractionCreate = async (interaction: Interaction): Promise<void> => {
  try {
    switch (interaction.type) {
    case InteractionType.ApplicationCommand: {
      const command = commands.get(interaction.commandName);

      if (!command) {
        logWarn('Discord', `Command "${interaction.commandName}" not found`);
        return;
      }

      await command.execute(interaction);
    }
    }

  } catch (err) {
    logError('Discord', 'Error during onInteractionCreate event', err);
  }
};