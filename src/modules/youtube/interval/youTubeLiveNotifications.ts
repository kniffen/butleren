import type { Collection, Guild, MessageCreateOptions } from 'discord.js';
import type { YouTubeChannelDBEntry } from '../../../types';
import type { YouTubeAPIVideo } from '../requests/getYouTubeVideos';
import { sendDiscordMessage } from '../../../discord/utils/sendDiscordMessage';
import { logDebug } from '../../logs/logger';

export const youTubeLiveNotifications = function(channelEntries: YouTubeChannelDBEntry[], youTubeVideos: YouTubeAPIVideo[], guilds: Collection<string, Guild>): void {
  const liveStreams = youTubeVideos.filter(video => 'live' === video.snippet.liveBroadcastContent);
  if (0 === liveStreams.length) {
    return;
  }

  for (const liveStream of liveStreams) {
    const entries = channelEntries.filter(entry => entry.channelId === liveStream.snippet.channelId);
    logDebug('YouTube', `Processing live stream ${liveStream.snippet.channelTitle}`, { entries, liveStream });
    const url = `https://www.youtube.com/watch?v=${liveStream.id}`;

    for (const { guildId, notificationChannelId, liveNotificationRoleId } of entries) {
      const guild = guilds.get(guildId);
      const message: MessageCreateOptions = {
        content: `${liveNotificationRoleId ? `<@&${liveNotificationRoleId}> ` : ''}${liveStream.snippet.channelTitle} is live on YouTube!\n${url}`,
      };

      logDebug('YouTube', `Posting live notification for ${liveStream.snippet.channelTitle}`, { guildId, notificationChannelId, liveNotificationRoleId } );
      sendDiscordMessage(notificationChannelId, guild, message);
    }
  }
};