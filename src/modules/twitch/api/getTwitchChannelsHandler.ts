import type { NextFunction, Request, Response } from 'express';
import type { TwitchChannel, TwitchChannelDBEntry } from '../../../types';
import { logInfo } from '../../logs/logger';
import { discordClient } from '../../../discord/client';
import { getDBEntries } from '../../../database/utils/getDBEntries';
import { getTwitchUsers } from '../requests/getTwitchUsers';
import { TWITCH_CHANNELS_TABLE_NAME } from '../constants';

export const getTwitchChannelsHandler = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const guildId = req.params['guildId'];
    logInfo('Twitch', `Requesting Twitch channels with path: ${req.path}`);
    const guild = await discordClient.guilds.fetch(guildId);
    const entries = await getDBEntries<TwitchChannelDBEntry>(TWITCH_CHANNELS_TABLE_NAME,{ guildId: guild.id });
    if (0 === entries.length) {
      res.status(200).json([]);
      return;
    }

    const ids = entries.map(entry => entry.id);
    const twitchUsers = await getTwitchUsers({ ids });

    const responseBody: TwitchChannel[] = entries.map(entry => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { guildId, ...notificationConfig } = entry;
      const twitchUser = twitchUsers?.find(c => c.id === notificationConfig.id);

      return {
        url:  twitchUser ? `https://twitch.tv/${twitchUser.login}` : '',
        name: twitchUser ? twitchUser.display_name : '',
        id:   twitchUser ? twitchUser.id : notificationConfig.id,
        notificationConfig
      } satisfies TwitchChannel;
    });

    res.status(200).json(responseBody);

  } catch(error) {
    next(error);
  }
};