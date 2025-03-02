import type { Client } from 'discord.js';
import { logInfo, logError } from "../../logger/logger";
import { updateGuildCommands } from '../utils/updateGuildCommands';
import { addGuildToDatabase } from '../../database/utils/addGuildToDatabase';

export const onReady = async (client: Client): Promise<void> => {
  try {
    client.user?.setActivity(process.env.npm_package_version || '');
    logInfo('Discord', `Logged in as "${client.user?.tag}"`);

    const guilds = await client.guilds.fetch().then((guildsCollection) => [...guildsCollection.values()]);
    const promises =
      guilds
        .map(({ id }) => {
          const guild = client.guilds.cache.get(id);
          return guild ? [updateGuildCommands(guild), addGuildToDatabase(guild)] : [];
        })
        .flat();

    await Promise.all(promises);

  } catch (err) {
    logError('Discord', 'Error during onReady event', err);
  }
};