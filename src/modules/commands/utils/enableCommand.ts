import type { Guild } from 'discord.js';
import type { BotCommand, CommandDBEntry, ModuleDBEntry } from '../../../types';
import { logInfo } from '../../logs/logger';
import { insertOrReplaceDBEntry } from '../../../database/utils/insertOrReplaceDBEntry';
import { modules } from '../../modules';
import { COMMANDS_TABLE_NAME } from '../constants';
import { MODULES_TABLE_NAME } from '../../core/constants';

export const enableCommand = async function(command: BotCommand, guild: Guild): Promise<void> {
  if (command.isLocked) {
    return;
  }

  const parentModule = modules.get(command.parentSlug);
  if (parentModule && !parentModule.isLocked) {
    await insertOrReplaceDBEntry<ModuleDBEntry>(MODULES_TABLE_NAME, {
      slug:      parentModule.slug,
      guildId:   guild.id,
      isEnabled: 1
    });
  }

  const discordCommands = await guild.commands.fetch();
  const applicationCommand = discordCommands.find((c) => c.name === command.slashCommandBuilder.name);
  if (!applicationCommand) {
    logInfo('Commands', `Adding command "${command.slashCommandBuilder.name}" to guild "${guild.name}"`);
    await guild.commands.create(command.slashCommandBuilder);
  }

  await insertOrReplaceDBEntry<CommandDBEntry>(COMMANDS_TABLE_NAME, {
    slug:      command.slashCommandBuilder.name,
    guildId:   guild.id,
    isEnabled: 1
  });
};