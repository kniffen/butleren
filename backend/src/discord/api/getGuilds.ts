import type { Request, Response } from 'express';
import { logDebug, logError, logInfo } from '../../logger/logger';
import { database } from '../../database/database';
import { client as discordClient } from '../client';
import type { GuildSettings, GuildsResponseBody } from '../../types';

export const getGuilds = async function(req: Request, res: Response): Promise<void> {
  try {
    logInfo('API', `Requesting Discord guilds with path: ${req.path}`);
    const db            = await database;
    const guildsData    = await db.all<{guildId: string, settings: string}[]>('SELECT * FROM guilds');
    logDebug('Database', 'guilds', guildsData);
    const guildSettings = new Map<string, GuildSettings>(guildsData.map(({ guildId, settings }) =>
      [guildId.toString(), JSON.parse(settings)]
    ));

    const guilds = await discordClient.guilds.fetch().then((guilds) => guilds.map(({ id }) => discordClient.guilds.cache.get(id)));
    logInfo('API', `Found ${guilds.length} guilds in Discord and ${guildSettings.size} guilds in the database`);
    logDebug('API', 'Guilds', guilds.map(guild => guild?.id));
    logDebug('API', 'Guild settings', guildSettings);

    const responseBody = guilds.reduce<GuildsResponseBody>((body, guild) => {
      if (!guild) {
        return body;
      }

      return [
        ...body,
        {
          id:       guild.id,
          name:     guild.name,
          iconURL:  guild.iconURL(),
          settings: guildSettings.get(guild.id)
        }
      ];
    }, []);

    res.json(responseBody);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logError('API', message, { error });
    res.sendStatus(500);
  }
};