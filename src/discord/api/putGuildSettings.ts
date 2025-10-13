import type { Request, Response, NextFunction } from 'express';
import { logDebug, logInfo } from '../../modules/logs/logger';
import type { GuildSettings } from '../../types';
import { discordClient } from '../client';
import { setGuildSettings } from '../database/setGuildSettings';

export const putGuildSettings = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try{
    if (!req.body) {
      res.status(400).send('Missing request body');
      return;
    }

    logInfo('Discord', `Updating guild settings with path: ${req.path}`);

    const settings = req.body as GuildSettings;
    logDebug('Discord', 'Request body', settings);
    if (
      (!settings.color || 'string' !== typeof settings.color)
    ) {
      res.status(400).send('Invalid request body');
      return;
    }

    const guildId = req.params['guild'];
    const guild = await discordClient.guilds.fetch(guildId);
    if (settings.nickname !== undefined && discordClient.user) {
      const member = await guild.members.fetch(discordClient.user.id);
      member.setNickname(settings.nickname || null);
    }

    await setGuildSettings(guild, settings);

    res.sendStatus(204);
  } catch(error) {
    next(error);
  }
};