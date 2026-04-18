import type { Guild } from 'discord.js';
import { modules } from '../modules/modules';
import { getGuildSettings } from '../discord/database/getGuildSettings';
import { setGuildSettings } from '../discord/database/setGuildSettings';
import { getDBEntries } from '../database/utils/getDBEntries';
import { insertOrReplaceDBEntry } from '../database/utils/insertOrReplaceDBEntry';
import type { CommandDBEntry, GuildSettings, ModuleDBEntry } from '../types';
import { COMMANDS_TABLE_NAME } from '../modules/commands/constants';
import { MODULES_TABLE_NAME } from '../modules/core/constants';

export const defaultGuildSettings: GuildSettings = {
  nickname: null,
  color:    '#19D8B4',
};

export const addGuildToDatabase = async (guild: Guild): Promise<void> => {
  const guildSettings = await getGuildSettings(guild);
  if (!guildSettings) {
    await setGuildSettings(guild, defaultGuildSettings);
  }

  await Promise.all([...modules.values()].map(async (mod) => {
    const [entry] = await getDBEntries<ModuleDBEntry>(MODULES_TABLE_NAME, { slug: mod.slug, guildId: guild.id });
    if (entry) {
      return;
    }

    await insertOrReplaceDBEntry<ModuleDBEntry>(MODULES_TABLE_NAME, {
      slug:      mod.slug,
      guildId:   guild.id,
      isEnabled: mod.defaultSettings.isEnabled ? 1 : 0,
    });

    await Promise.all([...mod.commands.entries()].map(async ([slug, cmd]) => {
      if (!cmd.isLocked) {
        await insertOrReplaceDBEntry<CommandDBEntry>(COMMANDS_TABLE_NAME, {
          slug,
          guildId:   guild.id,
          isEnabled: cmd.defaultSettings.isEnabled ? 1 : 0,
        });
      }
    }));
  }));
};