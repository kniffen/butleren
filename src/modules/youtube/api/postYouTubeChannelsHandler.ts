import type { NextFunction, Request, Response } from 'express';
import { schemas } from '@kniffen/butleren-api-specification';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { discordClient } from '../../../discord/client';
import { getYouTubeChannels } from '../requests/getYouTubeChannels';
import { validateDiscordChannel } from '../../../utils/validateDiscordChannel';
import { validateDiscordRole } from '../../../utils/validateDiscordRole';
import { YOUTUBE_CHANNELS_TABLE_NAME } from '../constants';
import { insertOrReplaceDBEntry } from '../../../database/utils/insertOrReplaceDBEntry';
import { YouTubeChannelDBEntry } from '../../../types';

export const postYouTubeChannelsHandler = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logInfo('YouTube', `Inserting YouTube channel with path: ${req.path}`);
    const guildId = req.params['guildId'];
    const guild = await discordClient.guilds.fetch(guildId);

    const body = schemas.YouTubeNotificationConfig.safeParse(req.body);
    if (!body.success) {
      logError('YouTube', 'Invalid request body for inserting YouTube channel', body.error);
      res.status(400).json({ error: 'Invalid request body' });
      return;
    }

    logDebug('YouTube', 'YouTube channels request body', body.data);

    const youTubeChannels = await getYouTubeChannels([body.data.channelId]);
    if (0 === youTubeChannels.length) {
      res.status(400).json({ error: `YouTube channel with id "${body.data.channelId}" not found` });
      return;
    }

    const isChannelValid = await validateDiscordChannel(body.data.notificationChannelId, guild, res);
    const isRoleValid = await validateDiscordRole(body.data.notificationRoleId, guild, res);
    if (!isChannelValid || !isRoleValid) {
      return;
    }

    await insertOrReplaceDBEntry<YouTubeChannelDBEntry>(YOUTUBE_CHANNELS_TABLE_NAME, {
      guildId:                guild.id,
      channelId:              body.data.channelId,
      includeLiveStreams:     body.data.includeLiveStreams ? 1 : 0,
      notificationChannelId:  body.data.notificationChannelId,
      notificationRoleId:     body.data.notificationRoleId,
      liveNotificationRoleId: body.data.liveNotificationRoleId,
    });

    res.sendStatus(201);

  } catch(error) {
    next(error);
  }
};