import type { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { BotCommand } from '../../../types';
import { getKickChannels } from '../requests/getKickChannels';
import { createKickStreamEmbed } from '../utils/createKickStreamEmbed';

const slashCommandBuilder =
  new SlashCommandBuilder()
    .setName('kickstream')
    .setDescription('Get information about a Kick stream')
    .addStringOption(option =>
      option
        .setName('channel')
        .setDescription('Name of the channel')
        .setRequired(true)
    );

const execute = async (commandInteraction: ChatInputCommandInteraction): Promise<void> => {
  const slug = commandInteraction.options.get('channel')?.value?.toString().split(' ').shift()?.toLowerCase();
  if (!slug) {
    await commandInteraction.reply({ content: 'Invalid channel name, please try again.', ephemeral: true });
    return;
  }

  await commandInteraction.deferReply();
  const kickChannels  = await getKickChannels({ slugs: [slug] });
  if (!kickChannels || 0 >= kickChannels.length)  {
    await commandInteraction.deleteReply();
    await commandInteraction.followUp({
      content:   'Sorry, I was unable to find that channel for you.',
      ephemeral: true,
    });
    return;
  }

  const [kickChannel] = kickChannels;
  const embed = createKickStreamEmbed(kickChannel, true);

  commandInteraction.editReply({ embeds: [embed] });
};

export const kickStreamCommand: BotCommand = {
  isLocked:        false,
  slashCommandBuilder,
  execute,
  defaultSettings: { isEnabled: false },
  parentSlug:      'kick',
};