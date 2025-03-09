import { Guild } from 'discord.js';
import { logInfo } from '../../logger/logger';
import { database } from '../database';
import { ModuleSettings } from '../../types';

export const getModuleSettings = async (slug: string, guild: Guild): Promise<ModuleSettings | null> => {
  logInfo('Database', `Reading settings for module "${slug}" in guild "${guild.name}"`);
  const db = await database;
  const row = await db.get(
    'SELECT settings FROM modules WHERE slug = ? AND guildId = ?',
    slug,
    guild.id,
  );

  return row ? JSON.parse(row.settings) as ModuleSettings : null;
};