import type { NextFunction, Request, Response } from 'express';
import { schemas } from '@kniffen/butleren-api-specification';
import { discordClient } from '../../../discord/client';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { validateDiscordChannel } from '../../../utils/validateDiscordChannel';
import { validateDiscordRole } from '../../../utils/validateDiscordRole';
import { insertOrReplaceDBEntry } from '../../../database/utils/insertOrReplaceDBEntry';
import { getSpotifyShows } from '../requests/getSpotifyShows';
import { SpotifyShowDBEntry } from '../../../types';
import { SPOTIFY_SHOWS_TABLE_NAME } from '../constants';

export const postSpotifyShowsHandler = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logInfo('Spotify', `Inserting show with path: ${req.path}`);
    const guildId = req.params['guildId'];
    const guild = await discordClient.guilds.fetch(guildId);

    const body = schemas.SpotifyNotificationConfig.safeParse(req.body);
    if (!body.success) {
      logError('Spotify', 'Invalid request body for inserting show', body.error);
      res.status(400).json({ error: 'Invalid request body' });
      return;
    }

    logDebug('Spotify', 'Shows request body', body.data);

    const spotifyShows = await getSpotifyShows([body.data.showId]);
    if (0 === spotifyShows.length) {
      res.status(400).json({ error: `Spotify show with id "${body.data.showId}" not found` });
      return;
    }

    const isChannelValid = await validateDiscordChannel(body.data.notificationChannelId, guild, res);
    const isRoleValid = await validateDiscordRole(body.data.notificationRoleId, guild, res);
    if (isChannelValid && isRoleValid) {
      await insertOrReplaceDBEntry<SpotifyShowDBEntry>(SPOTIFY_SHOWS_TABLE_NAME, { guildId: guild.id, ...body.data });
      res.sendStatus(201);
    }

  } catch(error) {
    next(error);
  }
};