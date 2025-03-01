import type { Guild } from "discord.js";
import { commands } from '../../modules/modules';

export const updateGuildCommands = async (guild: Guild) =>  {
  const applicationCommands = await guild.commands.fetch();

  commands.forEach(async (command) => {
    const applicationCommand = applicationCommands.find((applicationCommand) => applicationCommand.name === command.slashCommandBuilder.name);

    if (!applicationCommand) {
      console.log(`Discord: Adding command "${command.slashCommandBuilder.name}" to guild "${guild.name}"`);
      await guild.commands.create(command.slashCommandBuilder);
    } else {
      console.log(`Discord: Updating command "${command.slashCommandBuilder.name}" in guild "${guild.name}"`);
      await guild.commands.edit(applicationCommand, command.slashCommandBuilder);
    }
  });

  // Remove commands that are no longer in the module from the guild
  applicationCommands.forEach(async (applicationCommand) => {
    const command = commands.get(applicationCommand.name);

    if (!command) {
      console.log(`Discord: Removing command "${applicationCommand.name}" from guild "${guild.name}"`);
      await guild.commands.delete(applicationCommand);
    }
  });
}