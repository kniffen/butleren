import type { NextFunction, Request, Response } from 'express';
import type { YouTubeChannel, YouTubeChannelDBEntry } from '../../../types';
import { logInfo } from '../../logs/logger';
import { discordClient } from '../../../discord/client';
import { getDBEntries } from '../../../database/utils/getDBEntries';
import { YOUTUBE_CHANNELS_TABLE_NAME } from '../constants';
import { getYouTubeChannels } from '../requests/getYouTubeChannels';

export const getYouTubeChannelsHandler = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logInfo('YouTube', `Requesting YouTube channels with path: ${req.path}`);

    const guildId = req.params['guildId'];
    const guild = await discordClient.guilds.fetch(guildId);

    const entries = await getDBEntries<YouTubeChannelDBEntry>(YOUTUBE_CHANNELS_TABLE_NAME,{ guildId: guild.id });
    if (0 === entries.length) {
      res.status(200).json([]);
      return;
    }

    const channelIds = entries.map(entry => entry.channelId);
    const youTubeChannels = await getYouTubeChannels(channelIds);

    const responseBody: YouTubeChannel[] = entries.map(entry => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { guildId, ...notificationConfig } = entry;
      const youTubeChannel = youTubeChannels?.find(c => c.id === notificationConfig.channelId);

      return {
        channelId:          youTubeChannel?.id || notificationConfig.channelId,
        name:               youTubeChannel?.snippet.title || '',
        notificationConfig: {
          ...notificationConfig,
          includeLiveStreams: !!notificationConfig.includeLiveStreams,
        }
      } satisfies YouTubeChannel;
    });

    res.status(200).json(responseBody);

  } catch(error) {
    next(error);
  }
};