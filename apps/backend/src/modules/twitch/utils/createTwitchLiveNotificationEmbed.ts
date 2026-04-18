import { EmbedBuilder } from 'discord.js';
import type { TwitchStream } from '../requests/getTwitchStreams';
import { hexToRGB } from '../../logs/colors';
import { TWITCH_PURPLE } from '../constants';

export const createTwitchLiveNotificationEmbed = function(startDate: Date, stream: TwitchStream): EmbedBuilder {
  const embed = new EmbedBuilder();

  embed.setTitle(`${stream.user_name} is streaming on Twitch`);
  embed.setURL(`https://twitch.tv/${stream.user_login}`);
  embed.setColor(hexToRGB(TWITCH_PURPLE));
  embed.setDescription(`**${stream.title}**`);
  embed.setImage(`${stream.thumbnail_url.replace('{width}', '400').replace('{height}', '225')}?t=${startDate.valueOf()}`);
  embed.addFields({ name: 'Category', value: stream.game_name || 'Unknown' });
  embed.setTimestamp(startDate);

  return embed;
};