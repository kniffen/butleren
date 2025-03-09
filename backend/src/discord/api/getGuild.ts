import type { Request, Response } from 'express';
import { ChannelType } from 'discord.js';
import { logDebug, logError, logInfo, logWarn } from '../../logger/logger';
import { database } from '../../database/database';
import { client as discordClient } from '../client';
import type { GuildResponseBody, GuildSettings } from '../../types';

export const getGuild = async function(req: Request, res: Response): Promise<void> {
  try {
    const guildId = req.params['guild'];
    logInfo('API', `Requesting guild with path: ${req.path}`);

    const guild = await discordClient.guilds.fetch(guildId);
    if (!guild) {
      logWarn('Discord', `Guild not found with id: ${guildId}`);
      res.sendStatus(404);
      return;
    }

    const db = await database;
    const guildSettings =
      await db
        .get('SELECT settings FROM guilds WHERE guildId = ?', guildId)
        .then((row?: {settings: string}) => row ? JSON.parse(row.settings) as GuildSettings : undefined);

    const [channels, roles] = await Promise.all([
      [...(await guild.channels.fetch()).values()].filter(channel => null !== channel),
      await guild.roles.fetch(),
    ]);
    logInfo('API', `Found guild "${guild.name}" with ${channels.length} channels and ${roles.size} roles`);
    logDebug('API', 'Guild settings', guildSettings);

    const responseBody: GuildResponseBody = {
      id:       guild.id,
      name:     guild.name,
      iconURL:  guild.iconURL(),
      settings: guildSettings,
      channels: channels.reduce<GuildResponseBody['channels']>((channels, channel) => {
        const channelType = channelTypes[channel.type];
        return channelType ? [...(channels || []), { id: channel.id, name: channel.name, type: channelType }] : channels;
      }, []),
      roles: [...roles.values()].map((role) => ({ id: role.id, name: role.name })),
    };

    res.json(responseBody);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logError('API', message, { error });
    res.sendStatus(500);
  }
};

const channelTypes: Record<number, 'ANNOUNCEMENT' | 'TEXT' | 'VOICE' | 'CATEGORY'> = {
  [ChannelType.GuildAnnouncement]: 'ANNOUNCEMENT',
  [ChannelType.GuildCategory]:     'CATEGORY',
  [ChannelType.GuildText]:         'TEXT',
  [ChannelType.GuildVoice]:        'VOICE',
};