import type { NextFunction, Request, Response } from 'express';
import { schemas } from '@kniffen/butleren-api-specification';
import { modules } from '../../modules';
import { logInfo, logWarn } from '../../logs/logger';
import { discordClient } from '../../../discord/client';
import { disableCommand } from '../../commands/utils/disableCommand';
import { insertOrReplaceDBEntry } from '../../../database/utils/insertOrReplaceDBEntry';
import type { ModuleDBEntry } from '../../../types';
import { MODULES_TABLE_NAME } from '../constants';

export const putModuleSettings = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const guildId = req.params['guild'];
    const guild = await discordClient.guilds.fetch(guildId);
    if (!guild) {
      logWarn('Modules', `Guild not found with Id: ${guildId}`);
      res.sendStatus(404);
      return;
    }

    const slug = req.params['slug'];
    logInfo('Modules', `Requesting modules with path: ${req.path}`);

    const mod = modules.get(slug);
    if (!mod) {
      logWarn('Modules', `Module not found with slug: ${slug}`);
      res.sendStatus(404);
      return;
    }

    if (mod.isLocked) {
      logWarn('Modules', `Module "${mod.name}" is locked and cannot be modified`);
      res.sendStatus(403);
      return;
    }

    const settings = schemas.ModuleSettings.safeParse(req.body);
    if (false === settings.success) {
      logWarn('Modules', `Invalid settings for module "${mod.name}"`, { settings });
      res.sendStatus(400);
      return;
    }

    if (!settings.data.isEnabled) {
      logInfo('Modules', `Removing commands for module "${mod.name}" from guild "${guild.name}"`);
      await Promise.all([...mod.commands.values()].map(command => disableCommand(command, guild)));
    }

    await insertOrReplaceDBEntry<ModuleDBEntry>(MODULES_TABLE_NAME, {
      slug,
      guildId:   guild.id,
      isEnabled: settings.data.isEnabled ? 1 : 0,
    });

    res.sendStatus(204);
  } catch(error) {
    next(error);
  }
};