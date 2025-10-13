import { Collection, type Guild } from 'discord.js';
import type { SpotifyAPIShow } from '../requests/getSpotifyShows';
import type { SpotifyAPIShowEpisode } from '../requests/getSpotifyShowEpisodes';
import type { SpotifyShowDBEntry  } from '../../../types';
import { spotifyLiveNotifications } from './spotifyLiveNotifications';
import * as sendDiscordMessage from '../../../discord/utils/sendDiscordMessage';
import * as logger from '../../logs/logger';

describe('Spotify: spotifyLiveNotifications', () => {
  const sendDiscordMessageSpy = jest.spyOn(sendDiscordMessage, 'sendDiscordMessage').mockImplementation();
  const logErrorSpy = jest.spyOn(logger, 'logError').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should notify about new episodes', async () => {
    await spotifyLiveNotifications(date, showEntries, showEpisodes, guilds);

    expect(sendDiscordMessageSpy).toHaveBeenCalledTimes(3);
    expect(sendDiscordMessageSpy).toHaveBeenNthCalledWith(
      1,
      'channel-1234',
      guild1,
      { content: '<@&role-1234> A new episode from Show one is out!\n/path/to/episode-1' }
    );
    expect(sendDiscordMessageSpy).toHaveBeenNthCalledWith(
      2,
      'channel-5678',
      guild2,
      { content: 'A new episode from Show one is out!\n/path/to/episode-1' }
    );
    expect(sendDiscordMessageSpy).toHaveBeenNthCalledWith(
      3,
      'channel-1234',
      guild1,
      { content: 'A new episode from Show two is out!\n/path/to/episode-3' }
    );
    expect(logErrorSpy).not.toHaveBeenCalled();
  });
});

const date = new Date('1985-10-26T12:00:00Z');

const showEntries = [
  { guildId: '1234', showId: 'show-1', notificationChannelId: 'channel-1234', notificationRoleId: 'role-1234' },
  { guildId: '1234', showId: 'show-2', notificationChannelId: 'channel-1234', notificationRoleId: null },
  { guildId: '5678', showId: 'show-1', notificationChannelId: 'channel-5678', notificationRoleId: null }
] as unknown as SpotifyShowDBEntry[];

const show1 = { name: 'Show one',   id: 'show-1' } as SpotifyAPIShow;
const show2 = { name: 'Show two',   id: 'show-2' } as SpotifyAPIShow;
const show3 = { name: 'Show three', id: 'show-3' } as SpotifyAPIShow;

const episode1 = { name: 'Episode one',   id: 'episode-1', release_date: '1985-10-26', external_urls: { spotify: '/path/to/episode-1' } } as SpotifyAPIShowEpisode;
const episode2 = { name: 'Episode two',   id: 'episode-2', release_date: '1985-10-27', external_urls: { spotify: '/path/to/episode-2' } } as SpotifyAPIShowEpisode;
const episode3 = { name: 'Episode three', id: 'episode-3', release_date: '1985-10-26', external_urls: { spotify: '/path/to/episode-3' } } as SpotifyAPIShowEpisode;

const showEpisodes = new Collection<string, { show: SpotifyAPIShow, episodes: SpotifyAPIShowEpisode[] }>([
  ['show-1', { show: show1, episodes: [episode1, episode2] }],
  ['show-2', { show: show2, episodes: [episode3] }],
  ['show-3', { show: show3, episodes: [] }]
]);

const guild1 = { name: 'Guild one' } as Guild;
const guild2 = { name: 'Guild two' } as Guild;
const guilds = new Collection<string, Guild>([
  ['1234', guild1],
  ['5678', guild2]
]);