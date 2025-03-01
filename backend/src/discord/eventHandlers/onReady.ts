import type { Client } from 'discord.js';
import { updateGuildCommands } from '../utils/updateGuildCommands';

export const onReady = async (client: Client): Promise<void> => {
  try {
    client.user?.setActivity(process.env.npm_package_version || '');
    console.log(`Discord: Logged in as "${client.user?.tag}"`);

    const guilds   = await client.guilds.fetch();
    const promises = [...guilds.values()].map((guild) => client.guilds.fetch(guild.id).then(updateGuildCommands));

    await Promise.all(promises);

  } catch (err) {
    console.error("Discord: Error during onReady event", err);
  }
};