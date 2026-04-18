import { EmbedBuilder } from 'discord.js';
import { KICK_GREEN, KICK_URL } from '../constants';
import type { KickAPIChannel } from '../requests/getKickChannels';

export const createKickStreamEmbed = function(kickChannel: KickAPIChannel, includeViewerCount = false): EmbedBuilder {
  const embed = new EmbedBuilder();
  embed.setColor(KICK_GREEN);
  embed.setURL(`${KICK_URL}/${kickChannel.slug}`);

  if (kickChannel.stream.is_live) {
    embed.setTitle(`${kickChannel.slug} is streaming on Kick`);
    embed.setDescription(`**${kickChannel.stream_title}**`);
    embed.setImage(kickChannel.stream.thumbnail);
    embed.setImage(`${kickChannel.stream.thumbnail}?t=${Date.now()}`);

    embed.addFields(
      { name: 'Category', value: kickChannel.category.name || 'Unknown' },
      { name: 'Started',  value: `<t:${Math.round(new Date(kickChannel.stream.start_time).valueOf() / 1000)}:R>` }
    );

    if (includeViewerCount) {
      embed.addFields(
        { name: 'Viewers',  value: kickChannel.stream.viewer_count.toLocaleString() },
      );
    }

    embed.setTimestamp(new Date(kickChannel.stream.start_time));

  } else {
    embed.setTitle(`${kickChannel.slug} is offline`);
    embed.setDescription(`**${kickChannel.channel_description}**`);
    embed.setImage(kickChannel.banner_picture);
  }

  return embed;
};