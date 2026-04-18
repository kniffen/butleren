import type { Guild } from 'discord.js';
import { logInfo } from '../../modules/logs/logger';
import { commands } from '../../modules/modules';
import { getDBEntry } from '../../database/utils/getDBEntry';
import { COMMANDS_TABLE_NAME } from '../../modules/commands/constants';
import { CommandDBEntry } from '../../types';

export const updateGuildCommands = async (guild: Guild): Promise<void> => {
  const guildCommands = await guild.commands.fetch();

  commands.forEach(async (command, name) => {
    if (command.isLocked) {
      return;
    }

    const commandDBEntry = await getDBEntry<CommandDBEntry>(COMMANDS_TABLE_NAME, { slug: name, guildId: guild.id });
    const isEnabled = commandDBEntry ? !!commandDBEntry.isEnabled : false;
    const guildCommand = guildCommands.find((guildCommand) => guildCommand.name === command.slashCommandBuilder.name);

    if (!isEnabled) {
      if (guildCommand) {
        logInfo('Discord', `Removing command "${command.slashCommandBuilder.name}" from guild "${guild.name}" (deactivated)`);
        await guild.commands.delete(guildCommand);
      }
      return;
    }

    if (!guildCommand) {
      logInfo('Discord', `Adding command "${command.slashCommandBuilder.name}" to guild "${guild.name}"`);
      await guild.commands.create(command.slashCommandBuilder);
    } else {
      logInfo('Discord', `Updating command "${command.slashCommandBuilder.name}" in guild "${guild.name}"`);
      await guild.commands.edit(guildCommand, command.slashCommandBuilder);
    }
  });

  // Remove commands that are no longer in the bot from the guild
  guildCommands.forEach(async (applicationCommand) => {
    const command = commands.get(applicationCommand.name);

    if (!command || command.isLocked) {
      logInfo('Discord', `Removing command "${applicationCommand.name}" from guild "${guild.name}"`);
      await guild.commands.delete(applicationCommand);
    }
  });
};