import { EmbedBuilder } from 'discord.js';
import { KICK_GREEN, KICK_URL } from '../constants';
import type { KickAPIChannel } from '../requests/getKickChannels';
import type { KickAPILiveStream } from '../requests/getKickLiveStreams';

export const createKickStreamEmbed = function(data: KickAPIChannel | KickAPILiveStream, includeViewerCount = false): EmbedBuilder {
  const embed = new EmbedBuilder();
  embed.setColor(KICK_GREEN);
  embed.setURL(`${KICK_URL}/${data.slug}`);

  if (isLiveStream(data)) {
    embed.setTitle(`${data.slug} is streaming on Kick`);
    embed.setDescription(`**${data.stream_title}**`);
    embed.setImage(data.thumbnail);
    embed.setImage(`${data.thumbnail}?t=${Date.now()}`);

    embed.addFields(
      { name: 'Category', value: data.category.name || 'Unknown' },
      { name: 'Started',  value: `<t:${Math.round(new Date(data.started_at).valueOf() / 1000)}:R>` }
    );

    if (includeViewerCount) {
      embed.addFields(
        { name: 'Viewers',  value: data.viewer_count.toLocaleString() },
      );
    }

    embed.setTimestamp(new Date(data.started_at));

  } else {
    embed.setTitle(`${data.slug} is offline`);
    embed.setDescription(`**${data.channel_description}**`);
    embed.setImage(data.banner_picture);
  }

  return embed;
};

const isLiveStream = (data: KickAPIChannel | KickAPILiveStream): data is KickAPILiveStream => 'started_at' in data;