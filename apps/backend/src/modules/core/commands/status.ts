import os from 'node:os';
import process from 'node:process';
import type { ChatInputCommandInteraction } from 'discord.js';
import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { intervalToDuration } from 'date-fns';
import type { BotCommand } from '../../../types';
import { hexToRGB } from '../../logs/colors';
import { getGuildAccentColor } from '../../../utils/getGuildAccentColor';

const slashCommandBuilder =
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Status check');

const execute = async (commandInteraction: ChatInputCommandInteraction): Promise<void> => {
  const systemUptime  = formatUptime(os.uptime());
  const processUptime = formatUptime(process.uptime());

  const embed = new EmbedBuilder();
  embed.setTitle('Status');

  const accentColor = await getGuildAccentColor(commandInteraction.guild);
  embed.setColor(hexToRGB(accentColor));

  // TODO: system uptime incorrect, not counting days properly
  embed.addFields(
    { name: 'System time',   value: new Date().toJSON() },
    { name: 'System uptime', value: systemUptime },
    { name: 'Bot uptime',    value: processUptime },
    // TODO: Look into memory usage, show total heap?
    { name: 'Memory usage',  value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024).toLocaleString()} MB` }
  );

  await commandInteraction.reply({
    embeds: [embed]
  });
};

const formatUptime = (uptime: number): string => {
  const duration = intervalToDuration({
    start: new Date(Date.now() - uptime * 1000),
    end:   new Date()
  });

  const days    = duration.days || 0;
  const hours   = String(duration.hours   || 0).padStart(2, '0');
  const minutes = String(duration.minutes || 0).padStart(2, '0');
  const seconds = String(duration.seconds || 0).padStart(2, '0');

  return `${days}d ${hours}:${minutes}:${seconds}`;
};

export const statusCommand: BotCommand = {
  isLocked:        true,
  slashCommandBuilder,
  execute,
  defaultSettings: { isEnabled: true },
  parentSlug:      'core',
};