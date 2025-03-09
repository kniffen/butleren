import type { Guild } from 'discord.js';
import { modules } from '../../modules/modules';
import { getGuildSettings } from './getGuildSettings';
import { setGuildSettings } from './setGuildSettings';
import { getModuleSettings } from './getModuleSettings';
import { setModuleSettings } from './setModuleSettings';
import type { GuildSettings, ModuleSettings } from '../../types';

export const defaultGuildSettings: GuildSettings = {
  color:    '#19D8B4',
  timezone: 'UTC',
};

export const defaultModuleSettings: ModuleSettings = {
  isEnabled: false,
};

export const addGuildToDatabase = async (guild: Guild): Promise<void> => {
  const guildSettings = await getGuildSettings(guild);
  if (!guildSettings) {
    await setGuildSettings(guild, defaultGuildSettings);
  }

  await Promise.all([...modules.values()].map(async (mod) => {
    const moduleSettings = await getModuleSettings(mod.slug, guild);
    if (moduleSettings) {
      return;
    }

    await setModuleSettings(mod.slug, guild, defaultModuleSettings);
  }));
};