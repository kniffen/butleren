import { Client, REST, Routes, Events, GatewayIntentBits } from 'discord.js';
import * as modules from '../modules/modules.ts';
import { logger } from '../logger/logger.ts';
import type { Module } from '../types.ts';

if (!process.env.DISCORD_TOKEN) {
  throw new Error('DISCORD_TOKEN is not set');
}

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });
export const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

const commands = Object.values(modules).map((mod: Module) => mod.commands).flat();

client.on(Events.ClientReady, async (readyClient) => {
  logger.info(`Logged in as ${readyClient.user.tag}!`);

  try {
    logger.debug('Registering Discord commands');
    await rest.put(Routes.applicationCommands(readyClient.user.id), { body: commands });
    logger.debug('Successfully registered Discord commands');
  } catch (err) {
    logger.error('Failed to register Discord commands', err);
    console.error(err);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.find(({name}) => name === interaction.commandName);
    if (command) {
      logger.debug(`Command ${command.name} being executed by "${interaction.user.tag}"`);
      command.execute(interaction);
    }
  } catch (err) {
    logger.error('An error occurred while executing a command', err);
    console.error(err);
  }
});