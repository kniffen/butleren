import { ClientApplication } from 'discord.js';
import { logInfo } from '../../modules/logs/logger';
import { commands } from '../../modules/modules';

export const updateApplicationCommands = async (application: ClientApplication | null): Promise<void> => {
  if (!application) {
    logInfo('Discord', 'Client application is not ready.');
    return;
  }

  const applicationCommands = await application.commands.fetch();
  commands.forEach(async (command) => {
    if (!command.isLocked) {
      return;
    }

    const applicationCommand = applicationCommands?.find((applicationCommand) => applicationCommand.name === command.slashCommandBuilder.name);

    if (!applicationCommand) {
      logInfo('Discord', `Adding global command "${command.slashCommandBuilder.name}"`);
      await application.commands.create(command.slashCommandBuilder);
    } else {
      logInfo('Discord', `Updating global command "${command.slashCommandBuilder.name}"`);
      await application.commands.edit(applicationCommand, command.slashCommandBuilder);
    }
  });

  // Remove commands that are no longer in the bot
  applicationCommands.forEach(async (applicationCommand) => {
    const command = commands.get(applicationCommand.name);

    if (!command || !command.isLocked) {
      logInfo('Discord', `Removing command "${applicationCommand.name}"`);
      await application.commands.delete(applicationCommand);
    }
  });
};