import os from 'node:os';
import process from 'node:process';
import type { CommandInteraction } from 'discord.js';
import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { intervalToDuration } from 'date-fns';
import type { Command } from '../../../types';
import { hexToRGB } from '../../../logger/colors';

const slashCommandBuilder =
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Status check');

const execute = async (commandInteraction: CommandInteraction): Promise<void> => {
  const systemUptime  = formatUptime(os.uptime());
  const processUptime = formatUptime(process.uptime());

  const embed = new EmbedBuilder();
  embed.setTitle('Status');
  embed.setColor(hexToRGB('#19D8B4'));

  embed.addFields(
    { name: 'System time',   value: new Date().toJSON() },
    { name: 'System uptime', value: systemUptime },
    { name: 'Bot uptime',    value: processUptime },
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

export const statusCommand: Command = {
  isLocked: true,
  slashCommandBuilder,
  execute
};