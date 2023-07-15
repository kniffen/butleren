import { Client } from 'discord.js';

import addGuildToDatabase from '../../database/addGuildToDatabase';
import modules from '../../modules';

const commands = modules.reduce<BotCommand[]>((commands, mod) =>
  mod.commands ? [...commands, ...mod.commands] : commands
, []);

export default async function onReady(client: Client) {
  if (client.user && process.env.npm_package_version)
    client.user.setActivity(process.env.npm_package_version);

  console.log('Discord: Client is ready.');

  const guilds = await client.guilds.fetch().catch(console.error);
  if (!guilds) return;

  guilds.forEach(async ({ id }) => {
    const guild = await client.guilds.fetch(id).catch(console.error);
    if (!guild) return;

    await addGuildToDatabase(guild);

    const guildCommands = await guild.commands.fetch().catch(console.error);
    if (!guildCommands) return;

    commands.forEach(command => {
      if (!command.data.toJSON) return;

      const guildCommand = guildCommands.find(guildCommand => command.data.name === guildCommand.name);

      // In case a new locked command was added to the bot
      // we add it to the guild
      if (!guildCommand && command.isLocked) {
        guild.commands.create(command.data.toJSON()).catch(console.error);

        // Update existing guild commands in case the command data was updated
      } else if (guildCommand) {
        guild.commands.edit(guildCommand, command.data.toJSON()).catch(console.error);
      }
    });

    // In case a command was removed from the bot
    // we delete it from the guild
    guildCommands.forEach(guildCommand => {
      const command = commands.find(cmd => cmd.data.name === guildCommand.name);

      if (!command)
        guild.commands.delete(guildCommand).catch(console.error);
    });
  });
}