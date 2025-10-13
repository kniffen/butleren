import type { NextFunction, Request, Response } from 'express';
import { schemas } from '@kniffen/butleren-api-specification';
import { discordClient } from '../../../discord/client';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { insertOrReplaceDBEntry } from '../../../database/utils/insertOrReplaceDBEntry';
import { getTwitchUsers } from '../requests/getTwitchUsers';
import { validateDiscordChannel } from '../../../utils/validateDiscordChannel';
import { validateDiscordRole } from '../../../utils/validateDiscordRole';
import { TwitchChannelDBEntry } from '../../../types';
import { TWITCH_CHANNELS_TABLE_NAME } from '../constants';

export const postTwitchChannelsHandler = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logInfo('Twitch', `Inserting Twitch channel with path: ${req.path}`);
    const guildId = req.params['guildId'];
    const guild = await discordClient.guilds.fetch(guildId);

    const body = schemas.TwitchNotificationConfig.safeParse(req.body);
    if (!body.success) {
      logError('Twitch', 'Invalid request body for inserting Twitch channel', body.error);
      res.status(400).json({ error: 'Invalid request body' });
      return;
    }

    logDebug('Twitch', 'Twitch channels request body', body.data);

    const twitchUsers = await getTwitchUsers({ ids: [body.data.id] });
    if (0 === twitchUsers.length) {
      res.status(400).json({ error: `Twitch user with id "${body.data.id}" not found` });
      return;
    }

    const isChannelValid = await validateDiscordChannel(body.data.notificationChannelId, guild, res);
    const isRoleValid = await validateDiscordRole(body.data.notificationRoleId, guild, res);
    if (isChannelValid && isRoleValid) {
      await insertOrReplaceDBEntry<TwitchChannelDBEntry>(TWITCH_CHANNELS_TABLE_NAME, { guildId: guild.id, ...body.data });
      res.sendStatus(201);
    }

  } catch(error) {
    next(error);
  }
};