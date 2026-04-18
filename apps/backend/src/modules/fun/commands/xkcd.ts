import fetch from 'node-fetch';
import type { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { BotCommand } from '../../../types';
import { logDebug, logError, logInfo } from '../../../modules/logs/logger';

interface XKCDResponseBody {
  month: string;
  num: number;
  link: string;
  year: string;
  news: string;
  safe_title: string;
  transcript: string;
  alt: string;
  img: string;
  title: string;
  day: string;
}

const slashCommandBuilder =
  new SlashCommandBuilder()
    .setName('xkcd')
    .setDescription('Posts XKCD comics')
    .addStringOption(option =>
      option
        .setName('id')
        .setDescription('XKCD comic id')
    );

const execute = async (commandInteraction: ChatInputCommandInteraction): Promise<void> => {
  await commandInteraction.deferReply();

  const id  = commandInteraction.options.get('id')?.value;
  const url = 'string' === typeof id ? `https://xkcd.com/${id}/info.0.json` : 'https://xkcd.com/info.0.json';
  logInfo('Fun', 'Fetching XKCD comic', { url });
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.text();
    logError('Fun', `Failed to fetch XKCD comic: ${response.statusText}`, { error });
    await commandInteraction.editReply({
      content: 'Sorry, I was unable to fetch the XKCD comic',
      files:   ['https://imgs.xkcd.com/comics/not_available.png'],
    });
  }

  const data = await response.json() as XKCDResponseBody;
  logDebug('Fun', 'Fetched XKCD comic', data);
  await commandInteraction.editReply({
    content: data.title,
    files:   [data.img],
  });
};

export const xkcdCommand: BotCommand = {
  isLocked:        false,
  slashCommandBuilder,
  execute,
  defaultSettings: { isEnabled: false },
  parentSlug:      'fun',
};