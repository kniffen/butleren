import type { Client } from 'discord.js';
import { logInfo, logError } from '../../modules/logs/logger';
import { updateApplicationCommands } from '../utils/updateApplicationCommands';
import { updateGuildCommands } from '../utils/updateGuildCommands';
import { addGuildToDatabase } from '../../utils/addGuildToDatabase';

export const onReady = async (discordClient: Client): Promise<void> => {
  try {
    discordClient.user?.setActivity(process.env.npm_package_version || '');
    logInfo('Discord', `Logged in as "${discordClient.user?.tag}"`);

    await updateApplicationCommands(discordClient.application);

    const guilds = await discordClient.guilds.fetch().then((guildsCollection) => [...guildsCollection.values()]);
    const promises =
      guilds
        .map(({ id }) => {
          const guild = discordClient.guilds.cache.get(id);
          return guild ? [updateGuildCommands(guild), addGuildToDatabase(guild)] : [];
        })
        .flat();

    await Promise.all(promises);

  } catch (err) {
    logError('Discord', 'Error during onReady event', err);
  }
};