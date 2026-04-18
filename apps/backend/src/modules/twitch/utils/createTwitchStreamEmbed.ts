import { EmbedBuilder } from 'discord.js';
import type { TwitchStream } from '../requests/getTwitchStreams';
import type { TwitchUser } from '../requests/getTwitchUsers';
import { hexToRGB } from '../../logs/colors';
import { TWITCH_PURPLE } from '../constants';

export const createTwitchStreamEmbed = function(user: TwitchUser, stream: TwitchStream | undefined): EmbedBuilder {
  const embed = new EmbedBuilder();
  embed.setColor(hexToRGB(TWITCH_PURPLE));
  embed.setThumbnail(user.profile_image_url);
  embed.setURL(`https://twitch.tv/${user.login}`);

  if (!stream) {
    embed.setTitle(`${user.display_name} is currently offline`);
    embed.setDescription(`**${user.description}**`);
    embed.setImage(user.offline_image_url.replace('{width}', '400').replace('{height}', '225'));

    return embed;
  }

  embed.setTitle(`${user.display_name} is streaming on Twitch`);
  embed.setDescription(`**${stream.title}**`);
  embed.setImage(stream.thumbnail_url.replace('{width}', '400').replace('{height}', '225'));

  const timestamp = Math.round((new Date(stream.started_at)).valueOf() / 1000);
  embed.addFields(
    { name: 'Category', value: stream.game_name },
    { name: 'Viewers',  value: stream.viewer_count.toLocaleString() },
    { name: 'Started',  value: `<t:${timestamp}:R>` }
  );

  return embed;
};