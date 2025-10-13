import type { NextFunction, Request, Response } from 'express';
import { modules } from '../../modules';
import { database } from '../../../database/database';
import type { Module, ModuleDBEntry, ModuleSettings } from '../../../types';
import { logInfo } from '../../logs/logger';
import { discordClient } from '../../../discord/client';

export const getModules = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const guildId = req.params['guild'];
    logInfo('Modules', `Requesting modules with path: ${req.path}`);
    const guild = await discordClient.guilds.fetch(guildId);

    const db = await database;
    const settings =
      await db
        .all<ModuleDBEntry[]>('SELECT * FROM modules WHERE guildId = ?', guild.id)
        .then((data) => new Map<string, ModuleSettings>(data.map((row) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { guildId, slug, isEnabled } = row;
          return [slug, { isEnabled: !!isEnabled }];
        })));

    const responseBody: Module[] = [...modules.values()].map((mod) => ({
      slug:        mod.slug,
      name:        mod.name,
      description: mod.description,
      isLocked:    mod.isLocked,
      settings:    settings.get(mod.slug) || { isEnabled: false },
    }));

    res.status(200).json(responseBody);
  } catch(error) {
    next(error);
  }
};