import { Guild } from 'discord.js';
import { logError, logInfo, logDebug } from '../../logs/logger';
import { getKickChannels } from '../requests/getKickChannels';
import { getKickLiveStreams } from '../requests/getKickLiveStreams';
import { getEnabledGuilds } from '../../../utils/getEnabledGuilds';
import { kickLiveNotifications } from './kickLiveNotifications';
import { getDBEntries } from '../../../database/utils/getDBEntries';
import { KickChannelDBEntry } from '../../../types';
import { KICK_CHANNELS_TABLE_NAME } from '../constants';

export const onKickInterval = async (date: Date, guilds: Guild[]): Promise<void> => {
  // This ensures that the logic will only run every 5 min, on the 5 min mark
  // For example 12:00, 12:05, 12:10 etc...
  if (0 !== date.getMinutes() % 5) {
    return;
  }

  try {
    logInfo('Kick', 'Running onInterval event');

    const enabledGuilds = await getEnabledGuilds('kick', guilds);
    logDebug('Kick', 'Enabled guilds', { guilds: enabledGuilds.map(g => ({ id: g.id, name: g.name })) });

    const channelEntries = (await Promise.all(enabledGuilds.map((guild) => getDBEntries<KickChannelDBEntry>(KICK_CHANNELS_TABLE_NAME, { guildId: guild.id })))).flat();
    logDebug('Kick', 'Kick channel entries', { channelEntries });

    if (0 === channelEntries.length) {
      logInfo('Kick', 'No kick channels found in the database for enabled guilds, skipping...');
      return;
    }

    const broadcasterUserIds = [...new Set(channelEntries.map(entry => entry.broadcasterUserId))];
    const kickChannels = await getKickChannels({ broadcasterUserIds });
    if (null === kickChannels) {
      logError('Kick', 'Failed to get kick channels, skipping...');
      return;
    }

    const liveChannels = kickChannels
      .filter(channel => {
        if (!channel.stream.is_live) {
          return false;
        }

        const timeSinceLive = date.valueOf() - (new Date(channel.stream.start_time)).valueOf();
        return 300_000 > timeSinceLive;
      });
    if (0 === liveChannels.length) {
      logInfo('Kick', 'No new live kick channels found, skipping...');
      return;
    }

    const liveStreams = await getKickLiveStreams(liveChannels.map(channel => channel.broadcaster_user_id));
    if (null === liveStreams || 0 === liveStreams.length) {
      logError('Kick', 'Failed to get kick live streams, skipping...');
      return;
    }

    await kickLiveNotifications(channelEntries, liveStreams, enabledGuilds);

  } catch (err) {
    logError('Kick', 'Error during onInterval event', err);
  }
};
