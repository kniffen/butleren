import { Guild } from 'discord.js';
import { database } from '../database';
import type { ModuleSettings } from '../../types';
import { logInfo } from '../../logger/logger';

export const setModuleSettings = async (slug: string, guild: Guild, settings: ModuleSettings): Promise<void> => {
  logInfo('Database', `Setting settings for module "${slug}" in guild "${guild.name}"`);

  const db = await database;
  await db.run(
    'INSERT OR REPLACE INTO modules (slug, guildId, settings) VALUES (?,?,?)',
    slug,
    guild.id,
    JSON.stringify(settings),
  );

  logInfo('Database', `Updated settings for module "${slug}" in guild "${guild.name}"`);
};