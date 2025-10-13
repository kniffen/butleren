import type { NextFunction, Request, Response } from 'express';
import { ChannelType } from 'discord.js';
import { logDebug, logInfo } from '../../modules/logs/logger';
import { discordClient } from '../client';
import type { GuildResponseBody } from '../../types';
import { getGuildSettings } from '../database/getGuildSettings';
import { defaultGuildSettings } from '../../utils/addGuildToDatabase';

export const getGuild = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const guildId = req.params['guild'];
    logInfo('Discord', `Requesting guild with path: ${req.path}`);
    const guild = await discordClient.guilds.fetch(guildId);

    const guildSettings = await getGuildSettings(guild);
    const [channels, roles] = await Promise.all([
      [...(await guild.channels.fetch()).values()].filter(channel => null !== channel),
      await guild.roles.fetch(),
    ]);
    logInfo('Discord', `Found guild "${guild.name}" with ${channels.length} channels and ${roles.size} roles`);
    logDebug('Discord','Guild settings', guildSettings);

    const responseBody: GuildResponseBody = {
      id:       guild.id,
      name:     guild.name,
      iconURL:  guild.iconURL(),
      channels: channels.reduce<GuildResponseBody['channels']>((channels, channel) => {
        const channelType = channelTypes[channel.type];
        return channelType ? [...(channels || []), { id: channel.id, name: channel.name, type: channelType }] : channels;
      }, []),
      roles:    [...roles.values()].map((role) => ({ id: role.id, name: role.name })),
      settings: guildSettings || defaultGuildSettings
    };

    res.status(200).json(responseBody);
  } catch(error) {
    next(error);
  }
};

const channelTypes: Record<number, 'ANNOUNCEMENT' | 'TEXT' | 'VOICE' | 'CATEGORY'> = {
  [ChannelType.GuildAnnouncement]: 'ANNOUNCEMENT',
  [ChannelType.GuildCategory]:     'CATEGORY',
  [ChannelType.GuildText]:         'TEXT',
  [ChannelType.GuildVoice]:        'VOICE',
};