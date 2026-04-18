import fetch from 'node-fetch';
import type { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { BotCommand } from '../../../types';
import { logDebug, logError, logInfo } from '../../../modules/logs/logger';

interface ICanHasDadjokeResponseBody {
  id: string;
  joke: string;
  status: number;
}

const slashCommandBuilder =
  new SlashCommandBuilder()
    .setName('dadjoke')
    .setDescription('Posts a random dad joke');

const execute = async (commandInteraction: ChatInputCommandInteraction): Promise<void> => {
  await commandInteraction.deferReply();

  const url = 'https://icanhazdadjoke.com/';
  logInfo('Fun', 'Fetching dad joke', { url });
  const response = await fetch(url, { headers: { Accept: 'application/json', } });

  if (!response.ok) {
    const error = await response.text();
    logError('Fun', `Failed to fetch dad joke: ${response.statusText}`, { error });
    await commandInteraction.deleteReply();
    await commandInteraction.followUp({
      content:   'Sorry, I was unable to fetch a dad joke for you.',
      ephemeral: true,
    });
    return;
  }

  const data = await response.json() as ICanHasDadjokeResponseBody;
  logDebug('Fun', 'Fetched dad joke', data);
  await commandInteraction.editReply({ content: data.joke });
};

export const dadjokeCommand: BotCommand = {
  isLocked:        false,
  slashCommandBuilder,
  execute,
  defaultSettings: { isEnabled: false },
  parentSlug:      'fun',
};