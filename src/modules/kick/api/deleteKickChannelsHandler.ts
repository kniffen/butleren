import type { NextFunction, Request, Response } from 'express';
import { logInfo } from '../../logs/logger';
import { KickChannelDBEntry } from '../../../types';
import { getDBEntry } from '../../../database/utils/getDBEntry';
import { deleteDBEntry } from '../../../database/utils/deleteDBEntry';
import { KICK_CHANNELS_TABLE_NAME } from '../constants';


export const deleteKickChannelsHandler = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logInfo('Kick', `Removing kick channel with path: ${req.path}`);
    const guildId = req.params['guildId'];
    const broadcasterUserId = Number(req.params['broadcasterUserId']);

    const entry = await getDBEntry<KickChannelDBEntry>(KICK_CHANNELS_TABLE_NAME, { guildId, broadcasterUserId });
    if (!entry) {
      logInfo('Kick', 'No kick channel entry found', { guildId, broadcasterUserId });
      res.sendStatus(404);
      return;
    }

    await deleteDBEntry(KICK_CHANNELS_TABLE_NAME, { guildId, broadcasterUserId });

    res.sendStatus(204);
  } catch(error) {
    next(error);
  }
};