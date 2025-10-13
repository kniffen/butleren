import type { Guild } from 'discord.js';
import type { YouTubeChannelDBEntry } from '../../../types';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { getEnabledGuilds } from '../../../utils/getEnabledGuilds';
import { getDBEntries } from '../../../database/utils/getDBEntries';
import { getYouTubeActivities } from '../requests/getYouTubeActivities';
import { getYouTubeVideos } from '../requests/getYouTubeVideos';
import { youTubeVideoNotifications } from './youTubeVideoNotifications';
import { youTubeLiveNotifications } from './youTubeLiveNotifications';
import { YOUTUBE_CHANNELS_TABLE_NAME } from '../constants';

export const onYouTubeInterval = async (date: Date, guilds: Guild[]): Promise<void> => {
  // This ensures that the logic will only run every hour on the hour
  // For example 11:00, 12:00, 13:00 etc...
  if (0 !== date.getMinutes() % 60) {
    return;
  }

  try {
    logInfo('YouTube', 'Running onInterval event');

    const enabledGuilds = await getEnabledGuilds('youtube', guilds);
    logDebug('YouTube', 'Enabled guilds', { guilds: enabledGuilds.map(g => ({ id: g.id, name: g.name })) });

    const channelEntries = (await Promise.all(enabledGuilds.map((guild) => getDBEntries<YouTubeChannelDBEntry>(YOUTUBE_CHANNELS_TABLE_NAME,{ guildId: guild.id })))).flat();
    logDebug('YouTube', 'YouTube channel entries', { channelEntries });

    if (0 === channelEntries.length) {
      logInfo('YouTube', 'No YouTube channels found in the database for enabled guilds, skipping...');
      return;
    }

    const uniqueYouTubeChannelIds = [...new Set(channelEntries.map(entry => entry.channelId))];
    const youTubeActivities = await Promise.all(uniqueYouTubeChannelIds.map(channelId => getYouTubeActivities(channelId)));
    const uploadIds: string[] = youTubeActivities
      .flat()
      .reduce<string[]>((ids, activity) => {
        const isNew = (3.6e+6 > date.valueOf() - (new Date(activity.snippet.publishedAt)).valueOf());
        if (isNew && 'upload' === activity.snippet.type && activity.contentDetails.upload) {
          ids.push(activity.contentDetails.upload.videoId);
        }
        return ids;
      }, []);

    if (0 === uploadIds.length) {
      logInfo('YouTube', 'No new uploads found, skipping...');
      return;
    }

    const youTubeVideos = await getYouTubeVideos(uploadIds);
    await Promise.all([
      youTubeVideoNotifications(channelEntries, youTubeVideos, enabledGuilds),
      youTubeLiveNotifications(channelEntries, youTubeVideos, enabledGuilds),
    ]);

  } catch (error) {
    logError('YouTube', 'Error during onInterval event', { error });
  }

};