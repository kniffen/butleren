import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import subCommandLatesttweet from './twitter/latesttweet';

const subCommands: Record<string, (interaction: ChatInputCommandInteraction) => Promise<void>> = {
  'latesttweet': subCommandLatesttweet
};

export const data =
  new SlashCommandBuilder()
    .setName('twitter')
    .setDescription('Twitter integration')
    .addSubcommand(subcommand =>
      subcommand
        .setName('latesttweet')
        .setDescription('Latest tweet from a Twitter user')
        .addStringOption(option =>
          option
            .setName('handle')
            .setDescription('@handle for the Twitter user')
            .setRequired(true)
        )
    );

export async function execute(interaction: ChatInputCommandInteraction) {
  await subCommands[interaction.options.getSubcommand()](interaction);
}

export const twitterCommand: BotCommand = {
  isLocked: false,
  data,
  execute
};
