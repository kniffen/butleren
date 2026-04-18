import type { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { BotCommand } from '../../../types';
import { getWeatherLocation } from '../utils/getWeatherLocation';
import { logError } from '../../logs/logger';
import { getGooglePollenData } from '../utils/getGooglePollenData';
import { getGuildSettings } from '../../../discord/database/getGuildSettings';
import { createPollenEmbed } from '../utils/createPollenEmbed';

const slashCommandBuilder =
  new SlashCommandBuilder()
    .setName('pollen')
    .setDescription('Get a pollen report')
    .addStringOption(option => option.setName('location').setDescription('Location name'))
    .addStringOption(option => option.setName('zip').setDescription('ZIP code (US only)'))
    .addUserOption(option => option.setName('user').setDescription('A user'));

const execute = async (commandInteraction: ChatInputCommandInteraction): Promise<void> => {
  try {
    const location = await getWeatherLocation(commandInteraction);
    if (!location) {
      return;
    }

    await commandInteraction.deferReply();

    const guild = commandInteraction.guild;
    if (!guild) {
      throw new Error('Guild not found');
    }

    const guildSettings = await getGuildSettings(guild);
    if (!guildSettings) {
      throw new Error('Guild settings not found');
    }

    const openWeatherData = await getGooglePollenData(location.lat, location.lon);
    const embed = createPollenEmbed(guildSettings, openWeatherData, location);

    await commandInteraction.editReply({ embeds: [embed] });

  } catch (error: unknown) {
    logError('Weather', 'Unable to get pollen data', { error });
    await commandInteraction.deleteReply();
    await commandInteraction.followUp({
      content:   'Sorry, I was unable to get a pollen report for you. Please try again later.',
      ephemeral: true
    });
  }
};

export const pollenCommand: BotCommand = {
  isLocked:        false,
  slashCommandBuilder,
  execute,
  defaultSettings: { isEnabled: false },
  parentSlug:      'weather',
};