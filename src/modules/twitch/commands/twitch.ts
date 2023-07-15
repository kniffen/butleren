import DiscordJS, { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import subCommandStream from './twitch/stream';
import subCommandSchedule from './twitch/schedule';
import { BotCommand } from '../../../types/butleren';

const subCommands: Record<string, (interaction: ChatInputCommandInteraction) => Promise<DiscordJS.Message<boolean> | undefined>> = {
  'stream': subCommandStream,
  'schedule': subCommandSchedule,
};

const data =
  new SlashCommandBuilder()
    .setName('twitch')
    .setDescription('Twitch integration')
    .addSubcommand(subcommand =>
      subcommand
        .setName('stream')
        .setDescription('Information about a Twitch stream')
        .addStringOption(option =>
          option
            .setName('channel')
            .setDescription('Name of the channel')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('schedule')
        .setDescription('Schedule for a Twitch channel')
        .addStringOption(option =>
          option
            .setName('channel')
            .setDescription('Name of the channel')
            .setRequired(true)
        )
    );

const execute = async (interaction: ChatInputCommandInteraction) => {
  await subCommands[interaction.options.getSubcommand()](interaction);
};

export const twitchCommand: BotCommand = {
  isLocked: false,
  data,
  execute
};
