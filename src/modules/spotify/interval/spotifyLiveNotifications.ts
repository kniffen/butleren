import type { Collection, Guild, MessageCreateOptions } from 'discord.js';
import type { SpotifyShowDBEntry } from '../../../types';
import type { SpotifyAPIShow } from '../requests/getSpotifyShows';
import type { SpotifyAPIShowEpisode } from '../requests/getSpotifyShowEpisodes';
import { sendDiscordMessage } from '../../../discord/utils/sendDiscordMessage';
import { logInfo } from '../../logs/logger';

export const spotifyLiveNotifications = async function(
  date: Date,
  showEntries: SpotifyShowDBEntry[],
  showEpisodes: Collection<string, {show: SpotifyAPIShow, episodes: SpotifyAPIShowEpisode[]}>,
  guilds: Collection<string, Guild>
): Promise<void> {
  const dateStr = date.toJSON().slice(0, 10);
  for (const { show, episodes } of showEpisodes.values()) {
    const episodesThisDay = episodes.filter(episode => episode.release_date === dateStr);
    if (0 === episodesThisDay.length) {
      continue;
    }

    logInfo('Spotify', `Found ${episodesThisDay.length} new episodes for show ${show.name} released on ${dateStr}`);
    const dbEntries = showEntries.filter(entry => entry.showId === show.id);

    for (const dbEntry of dbEntries) {
      const { guildId, notificationChannelId, notificationRoleId } = dbEntry;
      const guild = guilds.get(guildId);

      for (const episode of episodesThisDay) {
        const message: MessageCreateOptions = {
          content: `${notificationRoleId ? `<@&${notificationRoleId}> ` : ''}A new episode from ${show.name} is out!\n${episode.external_urls.spotify}`
        };

        logInfo('Spotify', `Posting notification for episode ${episode.name} (${episode.id}) for show ${show.name}`);
        sendDiscordMessage(notificationChannelId, guild, message);
      }
    }
  }
};