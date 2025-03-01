import type { Guild } from "discord.js";
import { logInfo, logError } from "../../logger/logger";
import { updateGuildCommands } from "../utils/updateGuildCommands";

export const onGuildCreate = async (guild: Guild): Promise<void> => {
  try {
    logInfo('Discord', `Connected to new guild guild "${guild.name}"`);
    await updateGuildCommands(guild);

  } catch (err) {
    logError('Discord', 'Error during onGuildCreate event', err);
  }
};