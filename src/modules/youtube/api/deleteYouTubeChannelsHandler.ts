import type { NextFunction, Request, Response } from 'express';
import type { YouTubeChannelDBEntry } from '../../../types';
import { logInfo } from '../../logs/logger';
import { getDBEntry } from '../../../database/utils/getDBEntry';
import { deleteDBEntry } from '../../../database/utils/deleteDBEntry';
import { YOUTUBE_CHANNELS_TABLE_NAME } from '../constants';

export const deleteYouTubeChannelsHandler = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logInfo('YouTube', `Removing YouTube channel with path: ${req.path}`);
    const guildId = req.params['guildId'];
    const channelId = req.params['channelId'];

    const entry = await getDBEntry<YouTubeChannelDBEntry>(YOUTUBE_CHANNELS_TABLE_NAME, { guildId, channelId });
    if (!entry) {
      logInfo('YouTube', 'No YouTube channel entry found', { guildId, channelId });
      res.sendStatus(404);
      return;
    }

    await deleteDBEntry(YOUTUBE_CHANNELS_TABLE_NAME, { guildId, channelId });

    res.sendStatus(204);

  } catch(error) {
    next(error);
  }
};