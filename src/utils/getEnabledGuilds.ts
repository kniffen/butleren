import { Collection, Guild } from 'discord.js';
import { getDBEntries } from '../database/utils/getDBEntries';
import type { ModuleDBEntry } from '../types';
import { MODULES_TABLE_NAME } from '../modules/core/constants';

export const getEnabledGuilds = async function(moduleSlug: string, guilds: Guild[]): Promise<Collection<string, Guild>> {
  const moduleEntries  = await getDBEntries<ModuleDBEntry>(MODULES_TABLE_NAME, { slug: moduleSlug });
  const moduleGuildIds = moduleEntries.filter(entry => entry.isEnabled).map(entry => entry.guildId);
  const enabledGuilds  = guilds.filter(guild => moduleGuildIds.includes(guild.id));

  return new Collection(enabledGuilds.map(guild => [guild.id, guild]));
};