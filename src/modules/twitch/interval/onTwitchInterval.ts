import { Guild } from 'discord.js';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { getEnabledGuilds } from '../../../utils/getEnabledGuilds';
import { getDBEntries } from '../../../database/utils/getDBEntries';
import { getTwitchStreams } from '../requests/getTwitchStreams';
import { twitchLiveNotifications } from './twitchLiveNotifications';
import { TwitchChannelDBEntry } from '../../../types';
import { TWITCH_CHANNELS_TABLE_NAME } from '../constants';

export const onTwitchInterval = async (date: Date, guilds: Guild[]): Promise<void> => {
  // This ensures that the logic will only run every 5 min, on the 5 min mark
  // For example 12:00, 12:05, 12:10 etc...
  if (0 !== date.getMinutes() % 5) {
    return;
  }

  try {
    logInfo('Twitch', 'Running onInterval event');

    const enabledGuilds = await getEnabledGuilds('twitch', guilds);
    logDebug('Twitch', 'Enabled guilds', { guilds: enabledGuilds.map(g => ({ id: g.id, name: g.name })) });

    const channelEntries = (await Promise.all(enabledGuilds.map((guild) => getDBEntries<TwitchChannelDBEntry>(TWITCH_CHANNELS_TABLE_NAME,{ guildId: guild.id })))).flat();
    logDebug('Twitch', 'Twitch channel entries', { channelEntries });

    if (0 === channelEntries.length) {
      logInfo('Twitch', 'No Twitch channels found in the database for enabled guilds, skipping...');
      return;
    }

    const uniqueTwitchChannelIds = [...new Set(channelEntries.map(entry => entry.id))];
    const twitchChannels = await getTwitchStreams(uniqueTwitchChannelIds);

    await twitchLiveNotifications(date, channelEntries, twitchChannels, enabledGuilds);

  } catch (err) {
    logError('Twitch', 'Error during onInterval event', err);
  }
};
