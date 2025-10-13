import { EmbedBuilder } from 'discord.js';
import type { TwitchSchedule } from '../requests/getTwitchSchedule';
import type { TwitchUser } from '../requests/getTwitchUsers';
import { hexToRGB } from '../../logs/colors';
import { TWITCH_PURPLE } from '../constants';

export const createTwitchScheduleEmbed = function(user: TwitchUser, schedule: TwitchSchedule | null, limit = 5): EmbedBuilder {
  const embed = new EmbedBuilder();
  embed.setTitle(`Stream schedule for ${user.display_name}`);
  embed.setURL(`https://twitch.tv/${user.login}/schedule`);
  embed.setColor(hexToRGB(TWITCH_PURPLE));
  embed.setThumbnail(user.profile_image_url);
  embed.setFooter({ text: 'Times are in your local timezone' });

  if (null === schedule ||  0 === schedule.segments.length) {
    embed.setDescription(`${user.display_name} has no upcoming streams scheduled.`);
    return embed;
  }

  embed.addFields(schedule.segments.slice(0, limit).map(segment => {
    const startTime = Math.round((new Date(segment.start_time)).valueOf() / 1000);

    return {
      name:  `<t:${startTime}>`,
      value: `${segment.title}${segment.category ? ` ${segment.category.name}` : ''}`,
    };
  }));

  return embed;
};