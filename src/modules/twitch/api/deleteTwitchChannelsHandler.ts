import type { NextFunction, Request, Response } from 'express';
import { logInfo } from '../../../modules/logs/logger';
import { getDBEntry } from '../../../database/utils/getDBEntry';
import { deleteDBEntry } from '../../../database/utils/deleteDBEntry';
import { TwitchChannelDBEntry } from '../../../types';
import { TWITCH_CHANNELS_TABLE_NAME } from '../constants';


export const deleteTwitchChannelsHandler = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logInfo('Twitch', `Removing Twitch channel with path: ${req.path}`);
    const guildId = req.params['guildId'];
    const id = req.params['id'];

    const entry = await getDBEntry<TwitchChannelDBEntry>(TWITCH_CHANNELS_TABLE_NAME, { guildId, id });
    if (!entry) {
      logInfo('Twitch', 'No Twitch channel entry found', { guildId, id });
      res.sendStatus(404);
      return;
    }

    await deleteDBEntry(TWITCH_CHANNELS_TABLE_NAME, { guildId, id });

    res.sendStatus(204);
  } catch(error) {
    next(error);
  }
};