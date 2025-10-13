import type { NextFunction, Request, Response } from 'express';
import { logInfo } from '../../logs/logger';
import { discordClient } from '../../../discord/client';
import { getDBEntries } from '../../../database/utils/getDBEntries';
import { getSpotifyShows } from '../requests/getSpotifyShows';
import { SpotifyShow, SpotifyShowDBEntry } from '../../../types';
import { SPOTIFY_SHOWS_TABLE_NAME } from '../constants';

export const getSpotifyShowsHandler = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const guildId = req.params['guildId'];
    logInfo('Spotify', `Requesting Spotify shows with path: ${req.path}`);
    const guild = await discordClient.guilds.fetch(guildId);
    const entries = await getDBEntries<SpotifyShowDBEntry>(SPOTIFY_SHOWS_TABLE_NAME, { guildId: guild.id });
    if (0 === entries.length) {
      res.status(200).json([]);
      return;
    }

    const showIds = entries.map(entry => entry.showId);
    const shows = await getSpotifyShows(showIds);

    const responseBody: SpotifyShow[] = entries.map(entry => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { guildId, ...notificationConfig } = entry;
      const show = shows?.find(c => c.id === notificationConfig.showId);

      return {
        name:   show?.name || '',
        showId: show?.id   || notificationConfig.showId,
        notificationConfig
      } satisfies SpotifyShow;
    });

    res.status(200).json(responseBody);

  } catch(error) {
    next(error);
  }
};