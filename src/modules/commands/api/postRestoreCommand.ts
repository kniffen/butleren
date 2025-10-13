import type { NextFunction, Request, Response } from 'express';
import { logInfo } from '../../logs/logger';
import { discordClient } from '../../../discord/client';
import { commands } from '../../modules';
import { insertOrReplaceDBEntry } from '../../../database/utils/insertOrReplaceDBEntry';
import { removeApplicationCommand } from '../utils/removeApplicationCommand';
import { CommandDBEntry } from '../../../types';
import { COMMANDS_TABLE_NAME } from '../constants';

export const postRestoreCommand = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logInfo('Commands', `Restoring command with path: ${req.path}`);

    const slug = req.params['slug'];
    const command = commands.get(slug);
    if (!command) {
      logInfo('Commands', `Command not found with slug: ${slug}`);
      res.sendStatus(404);
      return;
    }

    if (command.isLocked) {
      logInfo('Commands', `Command is locked and cannot be restored: ${slug}`);
      res.sendStatus(403);
      return;
    }

    const guildId = req.params['guild'];
    const guild = await discordClient.guilds.fetch(guildId);

    await removeApplicationCommand(command.slashCommandBuilder.name, guild);
    if (command.defaultSettings.isEnabled) {
      await guild.commands.create(command.slashCommandBuilder);
    }

    await insertOrReplaceDBEntry<CommandDBEntry>(COMMANDS_TABLE_NAME, {
      slug:      command.slashCommandBuilder.name,
      guildId:   guild.id,
      isEnabled: command.defaultSettings.isEnabled ? 1 : 0,
    });

    res.sendStatus(204);

  } catch (error) {
    next(error);
  }
};

