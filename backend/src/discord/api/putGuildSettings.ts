import type { Request, Response } from 'express';
import { logDebug, logError, logInfo, logWarn } from '../../logger/logger';
import { database } from '../../database/database';
import type { GuildSettings } from '../../types';
import { client as discordClient } from '../client';

export const putGuildSettings = async function(req: Request, res: Response): Promise<void> {
  try {
    logInfo('API', `Updating guild settings with path: ${req.path}`);

    const settings = req.body as GuildSettings;
    logDebug('API', 'Request body', settings);
    if (
      (!settings.color || 'string' !== typeof settings.color)
    ) {
      res.status(400).send('Invalid request body');
      return;
    }

    const guildId = req.params['guild'];
    const guild = await discordClient.guilds.fetch(guildId);
    if (!guild) {
      logWarn('Discord', `Guild not found with id: ${guildId}`);
      res.sendStatus(404);
      return;
    }

    if (settings.nickname !== undefined && discordClient.user) {
      const member = await guild.members.fetch(discordClient.user.id);
      member.setNickname(settings.nickname || null);
    }

    const db = await database;
    await db.run('UPDATE guilds SET settings = ? WHERE guildId = ?', JSON.stringify(settings), guildId);

    res.sendStatus(204);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logError('API', message, { error });
    res.sendStatus(500);
  }
};