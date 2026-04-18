import type { Guild } from 'discord.js';
import { logInfo } from '../../modules/logs/logger';
import { database } from '../../database/database';
import type { GuildSettings } from '../../types';
import { getGuildSettings } from './getGuildSettings';

export const setGuildSettings = async (guild: Guild, settings: GuildSettings): Promise<void> => {
  logInfo('Discord', `Setting settings for guild "${guild.name}"`);

  const db = await database;
  const guildSettings = await getGuildSettings(guild);

  if (guildSettings) {
    await db.run(
      'UPDATE guilds SET color = ?, nickname = ? WHERE id = ?',
      settings.color,
      settings.nickname,
      guild.id,
    );
    logInfo('Database', `Updated settings for guild "${guild.name}"`);
    return;
  }

  await db.run(
    'INSERT OR IGNORE INTO guilds (id, color, nickname) VALUES (?, ?, ?)',
    guild.id,
    settings.color,
    settings.nickname,
  );
  logInfo('Database', `Created settings for guild "${guild.name}"`);
};