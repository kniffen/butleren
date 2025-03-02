import type { Guild } from "discord.js";
import { logError, logInfo } from "../../logger/logger";
import { database } from "../database";
import type { GuildSettings } from "../types";
import { getGuildSettings } from "./getGuildSettings";

export const setGuildSettings = async (guild: Guild, settings: GuildSettings) => {
  try {
    logInfo('Database', `Setting settings for guild "${guild.name}"`);

    const db = await database;
    const guildSettings = await getGuildSettings(guild);

    if (guildSettings) {
      await db.run(
        'UPDATE guilds SET settings = ? WHERE guildId = ?',
        JSON.stringify(settings),
        guild.id,
      );
      logInfo('Database', `Updated settings for guild "${guild.name}"`);
      return;
    }

    await db.run(
      'INSERT OR IGNORE INTO guilds (guildId, settings) VALUES (?, ?)',
      guild.id,
      JSON.stringify(settings),
    );
    logInfo('Database', `Created settings for guild "${guild.name}"`);

  } catch (err) {
    logError('Database', 'Error updating guild settings', err);
  }
}