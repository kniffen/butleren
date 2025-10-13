import type { NextFunction, Request, Response } from 'express';
import { logInfo } from '../../logs/logger';
import { getDBEntry } from '../../../database/utils/getDBEntry';
import { deleteDBEntry } from '../../../database/utils/deleteDBEntry';
import { SpotifyShowDBEntry } from '../../../types';
import { SPOTIFY_SHOWS_TABLE_NAME } from '../constants';

export const deleteSpotifyShowsHandler = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logInfo('Spotify', `Removing Spotify show with path: ${req.path}`);
    const guildId = req.params['guildId'];
    const showId = req.params['showId'];

    const entry = await getDBEntry<SpotifyShowDBEntry>(SPOTIFY_SHOWS_TABLE_NAME, { guildId, showId });
    if (!entry) {
      logInfo('Spotify', 'No Spotify show entry found', { guildId, showId });
      res.sendStatus(404);
      return;
    }

    await deleteDBEntry(SPOTIFY_SHOWS_TABLE_NAME, { guildId, showId });
    res.sendStatus(204);

  } catch(error) {
    next(error);
  }
};