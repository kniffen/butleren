import { Guild } from 'discord.js';
import type { Response } from 'express';

export const validateDiscordChannel = async function(channelId: string, guild: Guild, res: Response): Promise<boolean> {
  const discordChannel = await guild.channels.fetch(channelId).catch(() => null);

  if (!discordChannel || !discordChannel.isTextBased()) {
    res.status(400).json({ error: `Discord channel with id "${channelId}" not found or is not a text channel` });
    return false;
  }

  return true;
};