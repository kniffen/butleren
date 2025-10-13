import type { NextFunction, Request, Response } from 'express';
import { schemas } from '@kniffen/butleren-api-specification';
import { logInfo } from '../../logs/logger';
import { discordClient } from '../../../discord/client';
import { commands } from '../../modules';
import { enableCommand } from '../utils/enableCommand';
import { disableCommand } from '../utils/disableCommand';

export const putCommand = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logInfo('Commands', `Altering commands with path: ${req.path}`);

    const slug = req.params['slug'];
    const command = commands.get(slug);
    if (!command) {
      logInfo('Commands', `Command not found with slug: ${slug}`);
      res.sendStatus(404);
      return;
    } else if (command.isLocked) {
      logInfo('Commands', `Command "${command.slashCommandBuilder.name}" is locked and cannot be modified`);
      res.sendStatus(403);
      return;
    }

    const guildId = req.params['guild'];
    const guild = await discordClient.guilds.fetch(guildId);

    const settings = schemas.CommandSettings.safeParse(req.body);
    if (false === settings.success) {
      logInfo('Commands', `Invalid settings for command "${command.slashCommandBuilder.name}"`, { errors: settings.error.issues });
      res.sendStatus(400);
      return;
    }

    if (settings.data.isEnabled) {
      await enableCommand(command, guild);
    } else {
      await disableCommand(command, guild);
    }

    res.sendStatus(204);

  } catch (error) {
    next(error);
  }
};