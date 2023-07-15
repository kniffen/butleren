import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import profileSubCommandView        from './profile/view';
import profileSubCommandDelete      from './profile/delete';
import profileSubCommandSetLocation from './profile/setlocation';

const subCommands: Record<string, (interaction: ChatInputCommandInteraction) => Promise<void>> = {
  'view':        profileSubCommandView,
  'delete':      profileSubCommandDelete,
  'setlocation': profileSubCommandSetLocation,
};

const data =
  new SlashCommandBuilder()
    .setName('profile')
    .setDescription('User profile information')
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('View your profile')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('delete')
        .setDescription('Delete your profile')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('setlocation')
        .setDescription('Set your location')
        .addStringOption(option =>
          option
            .setName('location')
            .setDescription('Location name or zip code')
            .setRequired(true)
        )
    );

const execute = async (interaction: ChatInputCommandInteraction) => {
  await subCommands[interaction.options.getSubcommand()](interaction);
};

export const profileCommand: BotCommand = {
  isLocked: true,
  data,
  execute
};
