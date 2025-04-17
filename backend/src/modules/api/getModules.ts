import type { Request, Response } from 'express';
import { modules } from '../modules';
import { database } from '../../database/database';
import type { ModuleResponseBody } from '../../types';
import { logError, logInfo, logWarn } from '../../logger/logger';
import { client as discordClient } from '../../discord/client';

export const getModules = async function(req: Request, res: Response): Promise<void> {
  try {
    const guildId = req.params['guild'];
    logInfo('API', `Requesting modules with path: ${req.path}`);

    const guild = await discordClient.guilds.fetch(guildId);
    if (!guild) {
      logWarn('Discord', `Guild not found with id: ${guildId}`);
      res.sendStatus(404);
      return;
    }

    const db = await database;
    const settings =
      await db
        .all('SELECT slug, settings FROM modules WHERE guildId = ?', guildId)
        .then((data) => new Map(data.map((row) => [row.slug, JSON.parse(row.settings)])));

    const responseBody: ModuleResponseBody[] = [...modules.values()].map((mod) => ({
      slug:        mod.slug,
      name:        mod.name,
      description: mod.description,
      isLocked:    mod.isLocked,
      settings:    settings.get(mod.slug)
    }));

    res.json(responseBody);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logError('API', message, { error });
    res.sendStatus(500);
  }
};