import fetch from 'node-fetch';
import type { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { Command } from '../../../types';
import { logDebug, logError, logInfo } from '../../../logger/logger';

interface ICanHasDadjokeResponseBody {
  id: string;
  joke: string;
  status: number;
}

const slashCommandBuilder =
  new SlashCommandBuilder()
    .setName('dadjoke')
    .setDescription('Posts a random dad joke');

const execute = async (commandInteraction: CommandInteraction): Promise<void> => {
  await commandInteraction.deferReply();

  const url = 'https://icanhazdadjoke.com/';
  logInfo('Fun', 'Fetching dad joke', { url });
  const response = await fetch(url, { headers: { Accept: 'application/json', } });

  if (!response.ok) {
    const error = await response.text();
    logError('Fun', `Failed to fetch dad joke: ${response.statusText}`, { error });
    await commandInteraction.editReply('Sorry, I was unable to fetch a dad joke for you.');
  }

  const data = await response.json() as ICanHasDadjokeResponseBody;
  logDebug('Fun', 'Fetched dad joke', data);
  await commandInteraction.editReply({ content: data.joke });
};

export const dadjokeCommand: Command = {
  isLocked: false,
  slashCommandBuilder,
  execute
};