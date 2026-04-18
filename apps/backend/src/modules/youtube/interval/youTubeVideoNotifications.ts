import type { Collection, Guild, MessageCreateOptions } from 'discord.js';
import type { YouTubeChannelDBEntry } from '../../../types';
import type { YouTubeAPIVideo } from '../requests/getYouTubeVideos';
import { sendDiscordMessage } from '../../../discord/utils/sendDiscordMessage';
import { logDebug } from '../../logs/logger';

export const youTubeVideoNotifications = function(channelEntries: YouTubeChannelDBEntry[], youTubeVideos: YouTubeAPIVideo[], guilds: Collection<string, Guild>): void {
  const videos = youTubeVideos.filter(video => 'none' === video.snippet.liveBroadcastContent);
  if (0 === videos.length) {
    return;
  }

  for (const video of videos) {
    const entries = channelEntries.filter(entry => entry.channelId === video.snippet.channelId);
    logDebug('YouTube', `Processing video ${video.snippet.channelTitle}`, { entries, video });
    const url = `https://www.youtube.com/watch?v=${video.id}`;

    for (const { guildId, notificationChannelId, notificationRoleId } of entries) {
      const guild = guilds.get(guildId);
      const message: MessageCreateOptions = {
        content: `${notificationRoleId ? `<@&${notificationRoleId}> ` : ''}${video.snippet.channelTitle} posted a new YouTube video!\n${url}`,
      };

      logDebug('YouTube', `Posting video notification for ${video.snippet.channelTitle}`, { guildId, notificationChannelId, notificationRoleId } );
      sendDiscordMessage(notificationChannelId, guild, message);
    }
  }
};