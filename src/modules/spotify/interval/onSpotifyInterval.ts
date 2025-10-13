import { Collection, type Guild } from 'discord.js';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { getEnabledGuilds } from '../../../utils/getEnabledGuilds';
import { getDBEntries } from '../../../database/utils/getDBEntries';
import { getSpotifyShowEpisodes, type SpotifyAPIShowEpisode } from '../requests/getSpotifyShowEpisodes';
import { spotifyLiveNotifications } from './spotifyLiveNotifications';
import { getSpotifyShows, type SpotifyAPIShow } from '../requests/getSpotifyShows';
import { SpotifyShowDBEntry } from '../../../types';
import { SPOTIFY_SHOWS_TABLE_NAME } from '../constants';

export const onSpotifyInterval = async (date: Date, guilds: Guild[]): Promise<void> => {
  //Ensures that the logic only runs at 12:00 UTC
  if (12 !== date.getUTCHours() || 0 !== date.getUTCMinutes()) {
    return;
  }

  try {
    logInfo('Spotify', 'Running onInterval event');

    const enabledGuilds = await getEnabledGuilds('spotify', guilds);
    logDebug('Spotify', 'Enabled guilds', { guilds: enabledGuilds.map(g => ({ id: g.id, name: g.name })) });

    const showEntries = (await Promise.all(enabledGuilds.map((guild) => getDBEntries<SpotifyShowDBEntry>(SPOTIFY_SHOWS_TABLE_NAME,{ guildId: guild.id })))).flat();
    logDebug('Spotify', 'Spotify show entries', { showEntries });

    if (0 === showEntries.length) {
      logInfo('Spotify', 'No Spotify shows found in the database for enabled guilds, skipping...');
      return;
    }

    const uniqueSpotifyShowIds = [...new Set(showEntries.map(entry => entry.showId))];
    const shows = await getSpotifyShows(uniqueSpotifyShowIds);
    const showEpisodes = new Collection<string, {show: SpotifyAPIShow, episodes: SpotifyAPIShowEpisode[]}>();
    for (const show of shows) {
      // eslint-disable-next-line no-await-in-loop
      const episodes = await getSpotifyShowEpisodes(show.id);
      showEpisodes.set(show.id, { show, episodes });
    }

    spotifyLiveNotifications(date, showEntries, showEpisodes, enabledGuilds);

  } catch (error) {
    logError('Spotify', 'Error during onInterval event', { error });
  }

};