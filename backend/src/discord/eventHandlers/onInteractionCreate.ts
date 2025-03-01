import { type Interaction, InteractionType } from "discord.js";
import { commands } from "../../modules/modules";

export const onInteractionCreate = async (interaction: Interaction): Promise<void> => {
  try {
    switch (interaction.type) {
      case InteractionType.ApplicationCommand: {
        const command = commands.get(interaction.commandName);

        if (!command) {
          console.warn(`Discord: Command "${interaction.commandName}" not found`);
          return;
        }

        await command.execute(interaction);
      }
    }

  } catch (err) {
    console.error("Discord: Error during onInteractionCreate event", err);
  }
};