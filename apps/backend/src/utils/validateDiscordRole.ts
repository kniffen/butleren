import { Guild } from 'discord.js';
import type { Response } from 'express';

export const validateDiscordRole = async function(roleId: string | undefined | null, guild: Guild, res: Response): Promise<boolean> {
  if (!roleId) {
    return true;
  }

  const discordRole = await guild.roles.fetch(roleId);
  if (!discordRole) {
    res.status(400).json({ error: `Discord role with id "${roleId}" not found` });
    return false;
  }

  return true;
};