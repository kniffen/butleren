import type { Guild } from 'discord.js';
import type { BotCommand } from '../../../types';
import { logInfo } from '../../logs/logger';
import { insertOrReplaceDBEntry } from '../../../database/utils/insertOrReplaceDBEntry';
import { COMMANDS_TABLE_NAME } from '../constants';

export const disableCommand = async function(command: BotCommand, guild: Guild): Promise<void> {
  if (command.isLocked) {
    return;
  }

  const discordCommands = await guild.commands.fetch();
  const applicationCommand = discordCommands.find((c) => c.name === command.slashCommandBuilder.name);
  if (applicationCommand) {
    logInfo('Commands', `Removing command "${command.slashCommandBuilder.name}" from guild "${guild.name}"`);
    await guild.commands.delete(applicationCommand);
  }

  await insertOrReplaceDBEntry(COMMANDS_TABLE_NAME, {
    slug:      command.slashCommandBuilder.name,
    guildId:   guild.id,
    isEnabled: false
  });
};