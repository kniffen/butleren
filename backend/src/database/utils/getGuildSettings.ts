import type { Guild } from 'discord.js';
import { logInfo, logWarn } from '../../logger/logger';
import { database } from '../database';
import type { GuildSettings } from '../../types';

export const getGuildSettings = async (guild: Guild): Promise<GuildSettings | null> => {
  logInfo('Database', `Reading settings for guild "${guild.name}"`);
  const db = await database;
  const row = await db.get(
    'SELECT settings FROM guilds WHERE guildId = ?',
    guild.id,
  );

  if (!row) {
    logWarn('Database', `Guild settings not found for guild: "${guild.name}"`);
    return null;
  }

  return JSON.parse(row.settings) as GuildSettings;
};