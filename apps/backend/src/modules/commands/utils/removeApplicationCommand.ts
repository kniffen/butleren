import { Guild } from 'discord.js';
import { logInfo } from '../../logs/logger';

export const removeApplicationCommand = async  function(name: string, guild: Guild): Promise<void> {
  const discordCommands = await guild.commands.fetch();
  const applicationCommand = discordCommands.find((c) => c.name === name);
  if (!applicationCommand) {
    return;
  }

  logInfo('Commands', `Removing command "${name}" from guild "${guild.name}"`);
  await guild.commands.delete(applicationCommand);
  await removeApplicationCommand(name, guild);
};

