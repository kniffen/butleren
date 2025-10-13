import { Guild } from 'discord.js';
import { defaultGuildSettings } from './addGuildToDatabase';
import { getGuildSettings } from '../discord/database/getGuildSettings';

export const getGuildAccentColor = async function(guild: Guild | null): Promise<string> {
  if (!guild) {
    return defaultGuildSettings.color;
  }

  const guildSettings = await getGuildSettings(guild);
  return guildSettings?.color || defaultGuildSettings.color;
};