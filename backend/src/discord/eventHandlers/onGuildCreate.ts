import type { Guild } from 'discord.js';
import { logInfo, logError } from '../../logger/logger';
import { updateGuildCommands } from '../utils/updateGuildCommands';
import { addGuildToDatabase } from '../../database/utils/addGuildToDatabase';

export const onGuildCreate = async (guild: Guild): Promise<void> => {
  try {
    logInfo('Discord', `Connected to new guild guild "${guild.name}"`);
    await Promise.all([
      updateGuildCommands(guild),
      addGuildToDatabase(guild)
    ]);

  } catch (err) {
    logError('Discord', 'Error during onGuildCreate event', err);
  }
};