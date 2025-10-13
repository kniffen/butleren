import type { Collection, Guild, MessageCreateOptions } from 'discord.js';
import type { TwitchChannelDBEntry } from '../../../types';
import type { TwitchStream } from '../requests/getTwitchStreams';
import { logDebug } from '../../logs/logger';
import { sendDiscordMessage } from '../../../discord/utils/sendDiscordMessage';
import { createTwitchLiveNotificationEmbed } from '../utils/createTwitchLiveNotificationEmbed';

export const twitchLiveNotifications = function(date: Date, channelEntries: TwitchChannelDBEntry[], twitchStreams: TwitchStream[], guilds: Collection<string, Guild>): void {
  for (const twitchStream of twitchStreams) {
    const startDate = new Date(twitchStream.started_at);
    const minutesSinceStart = Math.floor((date.getTime() - startDate.getTime()) / 60000);
    if (5 < minutesSinceStart) {
      logDebug('Twitch', `Stream ${twitchStream.user_login} has been live for more than 5 minutes, skipping notification`);
      continue;
    }

    const entries = channelEntries.filter(entry => entry.id === twitchStream.user_id);

    logDebug('Twitch', `Processing live stream ${twitchStream.user_login}`, { entries, twitchStream });
    const embed = createTwitchLiveNotificationEmbed(startDate, twitchStream);
    for (const { guildId, notificationChannelId, notificationRoleId } of entries) {
      const guild = guilds.get(guildId);
      const message: MessageCreateOptions = {
        content: `${notificationRoleId ? `<@&${notificationRoleId}> ` : ''}${twitchStream.user_name} is live on Twitch!`,
        embeds:  [embed]
      };

      logDebug('Twitch', `Posting notification for ${twitchStream.user_login}`, { guildId, notificationChannelId, notificationRoleId } );
      sendDiscordMessage(notificationChannelId, guild, message);
    }
  }
};