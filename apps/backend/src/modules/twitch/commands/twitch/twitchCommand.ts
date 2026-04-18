import type { ChatInputCommandInteraction } from 'discord.js';
import type { BotCommand } from '../../../../types';
import { SlashCommandBuilder } from '@discordjs/builders';
import { twitchStreamCommand } from './subCommands/twitchStreamCommand';
import { twitchScheduleCommand } from './subCommands/twitchScheduleCommand';
import { logError } from '../../../logs/logger';
import { getTwitchUsers, type TwitchUser } from '../../requests/getTwitchUsers';

const slashCommandBuilder =
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

const subCommands: Record<string, (commandInteraction: ChatInputCommandInteraction, user: TwitchUser) => Promise<void> | undefined> = {
  stream:   twitchStreamCommand,
  schedule: twitchScheduleCommand,
};

export const execute = async (commandInteraction: ChatInputCommandInteraction): Promise<void> => {
  try {
    const channel = commandInteraction.options.get('channel')?.value?.toString().split(' ').shift();
    if (!channel) {
      await commandInteraction.reply({ content: 'Channel is required.', ephemeral: true });
      return;
    }

    await commandInteraction.deferReply();

    const users = await getTwitchUsers({ logins: [channel] });
    const user = users.at(0);
    if (!user) {
      await commandInteraction.deleteReply();
      await commandInteraction.followUp({
        content:   `Twitch channel "${channel}" not found, please check the name and try again.`,
        ephemeral: true,
      });
      return;
    }

    const subCommand = subCommands[commandInteraction.options.getSubcommand()];

    if (!subCommand) {
      throw new Error('Subcommand not found');
    }

    await subCommand(commandInteraction, user);
  } catch (error) {
    logError('Twitch', 'Error executing Twitch command', error);
    await commandInteraction.deleteReply();
    await commandInteraction.followUp({
      content:   'Sorry, I was unable to execute the command, please try again.',
      ephemeral: true,
    });
  }
};

export const twitchCommand: BotCommand = {
  isLocked:        false,
  slashCommandBuilder,
  execute,
  defaultSettings: { isEnabled: false },
  parentSlug:      'twitch',
};