import type { Guild } from 'discord.js';
import { logInfo, logWarn } from '../../modules/logs/logger';
import { database } from '../../database/database';
import type { GuildSettings } from '../../types';

export const getGuildSettings = async (guild: Guild): Promise<GuildSettings | null> => {
  logInfo('Discord', `Reading settings for guild "${guild.name}"`);
  const db = await database;
  const row = await db.get(
    'SELECT * FROM guilds WHERE id = ?',
    guild.id,
  );

  if (!row) {
    logWarn('Discord', `Guild settings not found for guild: "${guild.name}"`);
    return null;
  }

  return row as GuildSettings;
};