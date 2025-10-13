import type { NextFunction, Request, Response } from 'express';
import type { KickChannelDBEntry } from '../../../types';
import { schemas } from '@kniffen/butleren-api-specification';
import { logDebug, logError, logInfo } from '../../../modules/logs/logger';
import { discordClient } from '../../../discord/client';
import { insertOrReplaceDBEntry } from '../../../database/utils/insertOrReplaceDBEntry';
import { getKickChannels } from '../requests/getKickChannels';
import { validateDiscordChannel } from '../../../utils/validateDiscordChannel';
import { validateDiscordRole } from '../../../utils/validateDiscordRole';
import { KICK_CHANNELS_TABLE_NAME } from '../constants';

export const postKickChannelsHandler = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logInfo('Kick', `Inserting kick channel with path: ${req.path}`);
    const guildId = req.params['guildId'];
    const guild = await discordClient.guilds.fetch(guildId);

    const body = schemas.KickNotificationConfig.safeParse(req.body);
    if (!body.success) {
      logError('Kick', 'Invalid request body for inserting kick channel', body.error);
      res.sendStatus(400);
      return;
    }

    logDebug('Kick', 'Kick channels request body', body.data);

    const kickChannels = await getKickChannels({ broadcasterUserIds: [body.data.broadcasterUserId] });
    if (null === kickChannels || 0 === kickChannels.length) {
      res.status(400).json({ error: `Kick channel with broadcaster user id "${body.data.broadcasterUserId}" not found` });
      return;
    }

    const isChannelValid = await validateDiscordChannel(body.data.notificationChannelId, guild, res);
    const isRoleValid = await validateDiscordRole(body.data.notificationRoleId, guild, res);
    if (isChannelValid && isRoleValid) {
      await insertOrReplaceDBEntry<KickChannelDBEntry>(KICK_CHANNELS_TABLE_NAME, {
        guildId: guild.id,
        ...body.data
      });
      res.sendStatus(201);
    }


  } catch(error) {
    next(error);
  }
};