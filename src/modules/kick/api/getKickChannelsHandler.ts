import type { NextFunction, Request, Response } from 'express';
import { logInfo } from '../../logs/logger';
import { discordClient } from '../../../discord/client';
import { getDBEntries } from '../../../database/utils/getDBEntries';
import { getKickChannels } from '../requests/getKickChannels';
import type { KickChannel, KickChannelDBEntry } from '../../../types';
import { KICK_CHANNELS_TABLE_NAME } from '../constants';

export const getKickChannelsHandler = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const guildId = req.params['guildId'];
    logInfo('Kick', `Requesting kick channels with path: ${req.path}`);
    const guild = await discordClient.guilds.fetch(guildId);
    const entries = await getDBEntries<KickChannelDBEntry>(KICK_CHANNELS_TABLE_NAME, { guildId: guild.id });

    const broadcasterUserIds = entries.map(entry => entry.broadcasterUserId);
    const channels = await getKickChannels({ broadcasterUserIds });

    const responseBody: KickChannel[] = entries.map(entry => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { guildId, ...notificationConfig } = entry;
      const channel = channels?.find(c => c.broadcaster_user_id === notificationConfig.broadcasterUserId);

      return {
        url:               channel ? `https://kick.com/${channel.slug}` : '',
        name:              channel ? channel.slug : '',
        broadcasterUserId: channel ? channel.broadcaster_user_id : notificationConfig.broadcasterUserId,
        notificationConfig
      } satisfies KickChannel;
    });

    res.status(200).json(responseBody);

  } catch(error) {
    next(error);
  }
};