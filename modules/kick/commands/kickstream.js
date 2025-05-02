import DiscordJS from 'discord.js'
import moment from 'moment-timezone'
import { SlashCommandBuilder } from '@discordjs/builders';
import { getKickChannels } from '../utils/getKickChannels.js';
import { logger } from '../../../logger/logger.js'

export const isLocked = false
export const data =
  new SlashCommandBuilder()
    .setName('kickstream')
    .setDescription('Get information about a Kick stream')
    .addStringOption(option =>
      option
        .setName('channel')
        .setDescription('Name of the channel')
        .setRequired(true)
    );

/**
 * @param {Object} interaction - Discord interaction object.
 */
export async function execute(interaction) {
  try {
    await interaction.deferReply();

    const slug = interaction.options.get('channel')?.value.split(' ').shift().toLowerCase();
    const [ kickChannel ] = await getKickChannels({slugs: [slug]});

    if (!kickChannel) {
      return interaction.editReply({
        content: `Sorry, I was unable to find "${slug}" on Kick :(`,
        ephemeral: true
      });
    }

    const embed = new DiscordJS.EmbedBuilder();

    embed.setColor('#53FC18'); // Kick green
    embed.setURL(`https://kick.com/${kickChannel.slug}`);

    if (kickChannel.stream.is_live) {
      embed.setTitle(`${kickChannel.slug} is streaming on Kick`);
      embed.setDescription(`**${kickChannel.stream_title}**`);
      embed.setImage(kickChannel.stream.thumbnail);
      embed.addFields(
        {name: 'Category', value: kickChannel.category.name || 'Unknown'},
        {name: 'Viewers',  value: kickChannel.stream.viewer_count.toLocaleString()},
        {name: 'Started',  value: `<t:${moment(kickChannel.stream.start_time).format('X')}:R>`}
      );

    } else {
      embed.setTitle(`${kickChannel.slug} is offline`);
      embed.setDescription(`**${kickChannel.channel_description}**`);
      embed.setImage(kickChannel.banner_picture);
    }

    interaction.editReply({embeds: [embed]})

  } catch(err) {
    logger.error('Kick: kickstream command', err)
    console.error(err)
  }
}
