import { Collection, type Guild } from 'discord.js';
import * as getEnabledGuilds  from '../../../utils/getEnabledGuilds';
import * as getDBEntries  from '../../../database/utils/getDBEntries';
import * as getSpotifyShows  from '../requests/getSpotifyShows';
import * as getSpotifyShowEpisodes  from '../requests/getSpotifyShowEpisodes';
import * as spotifyLiveNotifications  from './spotifyLiveNotifications';
import { SpotifyAPIShow } from '../requests/getSpotifyShows';
import { onSpotifyInterval } from './onSpotifyInterval';
import { SpotifyShowDBEntry } from '../../../types';
import { SpotifyAPIShowEpisode } from '../requests/getSpotifyShowEpisodes';

describe('Spotify: onSpotifyInterval', () => {
  const getEnabledGuildsMock         = jest.spyOn(getEnabledGuilds,         'getEnabledGuilds'        ).mockImplementation();
  const getDBEntriesMock             = jest.spyOn(getDBEntries,             'getDBEntries'            ).mockImplementation();
  const getSpotifyShowsMock          = jest.spyOn(getSpotifyShows,          'getSpotifyShows'         ).mockImplementation();
  const getSpotifyShowEpisodesMock   = jest.spyOn(getSpotifyShowEpisodes,   'getSpotifyShowEpisodes'  ).mockImplementation();
  const spotifyLiveNotificationsMock = jest.spyOn(spotifyLiveNotifications, 'spotifyLiveNotifications').mockImplementation();

  beforeAll(() => {
    getEnabledGuildsMock.mockResolvedValue(enabledGuilds);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test('It should trigger notifications for new episodes', async () => {
    getDBEntriesMock.mockResolvedValueOnce([spotifyShowDBEntries[0], spotifyShowDBEntries[1]]);
    getDBEntriesMock.mockResolvedValueOnce([spotifyShowDBEntries[2]]);

    getSpotifyShowsMock.mockResolvedValueOnce([show1, show2]);
    getSpotifyShowEpisodesMock.mockResolvedValueOnce([episode1, episode2]);
    getSpotifyShowEpisodesMock.mockResolvedValueOnce([episode2, episode1]);

    const expectedCollection = new Collection<string, {show: SpotifyAPIShow, episodes: SpotifyAPIShowEpisode[]}>([
      ['show-1', { show: show1, episodes: [episode1, episode2] }],
      ['show-2', { show: show2, episodes: [episode2, episode1] }]
    ]);

    await onSpotifyInterval(date, guilds);

    expect(getEnabledGuildsMock).toHaveBeenCalledWith('spotify', guilds);
    expect(getDBEntriesMock).toHaveBeenCalledTimes(2);
    expect(getDBEntriesMock).toHaveBeenNthCalledWith(1, 'spotifyShows', { guildId: '1234' });
    expect(getDBEntriesMock).toHaveBeenNthCalledWith(2, 'spotifyShows', { guildId: '5678' });
    expect(getSpotifyShowsMock).toHaveBeenCalledWith(['show-1', 'show-2']);
    expect(spotifyLiveNotificationsMock).toHaveBeenCalledWith(date, spotifyShowDBEntries, expectedCollection, enabledGuilds);
  });

  test('It should not run at 12:00 UTC', async () => {
    await Promise.all([
      onSpotifyInterval(new Date('1985-10-26T12:00:00Z'), guilds), // Run
      onSpotifyInterval(new Date('1985-10-26T12:01:00Z'), guilds), // Ignore
      onSpotifyInterval(new Date('1985-10-26T12:04:00Z'), guilds), // Ignore
      onSpotifyInterval(new Date('1985-10-26T12:05:00Z'), guilds), // Ignore
      onSpotifyInterval(new Date('1985-10-26T12:50:00Z'), guilds), // Ignore
      onSpotifyInterval(new Date('1985-10-26T12:55:00Z'), guilds), // Ignore
      onSpotifyInterval(new Date('1985-10-26T12:59:00Z'), guilds), // Ignore
      onSpotifyInterval(new Date('1985-10-26T11:00:00Z'), guilds), // Ignore
      onSpotifyInterval(new Date('1985-10-26T13:00:00Z'), guilds), // Ignore
      onSpotifyInterval(new Date('1985-10-26T00:00:00Z'), guilds), // Ignore
      onSpotifyInterval(new Date('1985-10-26T23:00:00Z'), guilds), // Ignore
      onSpotifyInterval(new Date('1985-10-26T23:59:00Z'), guilds), // Ignore
    ]);

    expect(getEnabledGuildsMock).toHaveBeenCalledTimes(1);
  });

  test('It should not request shows if there are no channel entries for enabled guilds', async () => {
    getDBEntriesMock.mockResolvedValueOnce([]);
    getDBEntriesMock.mockResolvedValueOnce([]);

    await onSpotifyInterval(date, guilds);

    expect(getEnabledGuildsMock).toHaveBeenCalledWith('spotify', guilds);
    expect(getSpotifyShowsMock).not.toHaveBeenCalled();
    expect(spotifyLiveNotificationsMock).not.toHaveBeenCalled();
  });
});

const date = new Date('1985-10-26T12:00:00Z');

const show1 = { id: 'show-1', name: 'Show one' } as unknown as SpotifyAPIShow;
const show2 = { id: 'show-2', name: 'Show two' } as unknown as SpotifyAPIShow;

const episode1 = { id: 'episode-1', name: 'Episode one', release_date: '2024-01-01' } as unknown as SpotifyAPIShowEpisode;
const episode2 = { id: 'episode-2', name: 'Episode two', release_date: '2024-01-02' } as unknown as SpotifyAPIShowEpisode;

const spotifyShowDBEntries: SpotifyShowDBEntry[] = [
  { guildId: '1234', showId: 'show-1', notificationChannelId: 'c-1111', notificationRoleId: 'e-1111' },
  { guildId: '1234', showId: 'show-2', notificationChannelId: 'c-1111', notificationRoleId: null    },
  { guildId: '5678', showId: 'show-1', notificationChannelId: 'c-2222', notificationRoleId: 'e-2222' }
];

const enabledGuilds = new Collection([
  ['1234', { id: '1234', name: 'Guild one' }],
  ['5678', { id: '5678', name: 'Guild two' }]
]) as Collection<string, Guild>;

const guilds = [
  ['1234', { id: '1234', name: 'Guild one' }],
  ['5678', { id: '5678', name: 'Guild two' }],
  ['9999', { id: '9999', name: 'Guild three' }]
] as unknown as Guild[];