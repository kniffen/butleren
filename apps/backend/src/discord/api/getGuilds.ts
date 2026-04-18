import type { NextFunction, Request, Response } from 'express';
import { logDebug, logInfo } from '../../modules/logs/logger';
import { database } from '../../database/database';
import { discordClient } from '../client';
import type { GuildSettings, GuildResponseBody, GuildDBEntry } from '../../types';
import { defaultGuildSettings } from '../../utils/addGuildToDatabase';

export const getGuilds = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logInfo('Discord', `Requesting Discord guilds with path: ${req.path}`);
    const db            = await database;
    const guildsData    = await db.all<GuildDBEntry[]>('SELECT * FROM guilds');
    logDebug('Discord', 'guilds', guildsData);

    const guildSettings = new Map<string, GuildSettings>(guildsData.map(({ id, ...settings }) =>
      [id, settings]
    ));

    const guilds = await discordClient.guilds.fetch().then((guilds) => guilds.map(({ id }) => discordClient.guilds.cache.get(id)));
    logInfo('Discord', `Found ${guilds.length} guilds in Discord and ${guildSettings.size} guilds in the database`);
    logDebug('Discord', 'Guilds', guilds.map(guild => guild?.id));
    logDebug('Discord', 'Guild settings', guildSettings);

    const responseBody = guilds.reduce<GuildResponseBody[]>((body, guild) => {
      if (!guild) {
        return body;
      }

      return [
        ...body,
        {
          id:       guild.id,
          name:     guild.name,
          iconURL:  guild.iconURL(),
          settings: guildSettings.get(guild.id) || defaultGuildSettings,
        } satisfies GuildResponseBody
      ];
    }, []);

    res.status(200).json(responseBody);
  } catch(error) {
    next(error);
  }
};