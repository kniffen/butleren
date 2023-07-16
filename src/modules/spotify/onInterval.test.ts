import { Guild, Message, TextChannel } from 'discord.js';
import database from '../../database';

import spotifyOnInterval from './onInterval';
import {
  fetchSpotifyShows,
  fetchSpotifyShowEpisodes
} from './utils';
import { SpotifyShow, SpotifyShowEpisodes } from './types';

jest.mock(
  './utils/fetchSpotifyShows',
  () => ({ __esModule: true, fetchSpotifyShows: jest.fn() })
);

jest.mock(
  './utils/fetchSpotifyShowEpisodes',
  () => ({ __esModule: true, fetchSpotifyShowEpisodes: jest.fn() })
);

describe('modules.spotify.onInterval()', function () {
  let db: Awaited<typeof database>;

  const fetchSpotifyShowsMock = fetchSpotifyShows as jest.MockedFunction<typeof fetchSpotifyShows>;
  const fetchSpotifyShowEpisodesMock = fetchSpotifyShowEpisodes as jest.MockedFunction<typeof fetchSpotifyShowEpisodes>;

  const notificationChannel001 = { send: jest.fn(async () => undefined) } as unknown as TextChannel;
  const notificationChannel002 = { send: jest.fn(async () => undefined) } as unknown as TextChannel;

  const guild001 = {
    id: 'guild001',
    channels: {
      fetch: jest.fn(async () => notificationChannel001)
    }
  } as unknown as Guild;

  const guild002 = {
    id: 'guild002',
    channels: {
      fetch: jest.fn(async () => notificationChannel002)
    }
  } as unknown as Guild;

  const defaultDatabaseEntries = [
    { guildId: 'guild001', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: 'role001' },
    { guildId: 'guild001', id: 'show002', latestEpisodeId: 'show002_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
    { guildId: 'guild002', id: 'show001', latestEpisodeId: 'show001_episode001', notificationChannelId: 'channel001', notificationRoleId: null },
  ];

  async function resetShowsInDatabase() {
    await db.run('DELETE FROM spotifyShows');

    await db.run(
      'INSERT INTO spotifyShows (guildId, id, latestEpisodeId, notificationChannelId, notificationRoleId) VALUES (?,?,?,?,?)',
      ['guild001', 'show001', null, 'channel001', 'role001']
    );
    await db.run(
      'INSERT INTO spotifyShows (guildId, id, latestEpisodeId, notificationChannelId) VALUES (?,?,?,?)',
      ['guild001', 'show002', 'show002_episode003', 'channel001']
    );
    await db.run(
      'INSERT INTO spotifyShows (guildId, id, latestEpisodeId, notificationChannelId) VALUES (?,?,?,?)',
      ['guild002', 'show001', 'show001_episode001', 'channel001']
    );
  }

  beforeAll(async function () {
    db = await database;

    await db.migrate();

    await db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['spotify', 'guild001', true]);
    await db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['spotify', 'guild002', true]);

    fetchSpotifyShowsMock.mockImplementation(async (ids?: string[]) => {
      const shows = ids?.map(id => ({ id, name: `${id}_name` } as unknown as SpotifyShow)) || [];
      return shows;
    });

    fetchSpotifyShowEpisodesMock.mockImplementation(async (id: string) => {
      const episodes = [
        { id: `${id}_episode003`, external_urls: { spotify: `${id}_episode003_url` } },
        { id: `${id}_episode002`, external_urls: { spotify: `${id}_episode002_url` } },
        { id: `${id}_episode001`, external_urls: { spotify: `${id}_episode001_url` } },
      ] as unknown as SpotifyShowEpisodes['items'];

      return episodes;
    });

    jest.spyOn(db, 'all');
    jest.spyOn(db, 'run');
  });

  beforeEach(async function () {
    await resetShowsInDatabase();
    jest.clearAllMocks();
  });

  afterAll(function () {
    jest.restoreAllMocks();
  });

  it('Should announce new show episodes', async function () {
    await spotifyOnInterval({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00')) });

    expect(console.error).not.toHaveBeenCalled();
    expect(fetchSpotifyShowsMock).toHaveBeenCalledTimes(1);
    expect(fetchSpotifyShowsMock).toHaveBeenCalledWith(['show001', 'show002']);
    expect(fetchSpotifyShowEpisodesMock).toHaveBeenCalledTimes(2);
    expect(fetchSpotifyShowEpisodesMock).toHaveBeenNthCalledWith(1, 'show001');
    expect(fetchSpotifyShowEpisodesMock).toHaveBeenNthCalledWith(2, 'show002');

    expect(notificationChannel001.send).toHaveBeenCalledWith({
      content: '<@&role001> A new episode from show001_name is out!\nshow001_episode003_url'
    });

    expect(notificationChannel002.send).toHaveBeenCalledWith({
      content: 'A new episode from show001_name is out!\nshow001_episode003_url'
    });

    expect(db.run).toHaveBeenCalledTimes(2);
    expect(await db.all('SELECT * FROM spotifyShows')).toEqual([
      { guildId: 'guild001', id: 'show001', latestEpisodeId: 'show001_episode003', notificationChannelId: 'channel001', notificationRoleId: 'role001' },
      { guildId: 'guild001', id: 'show002', latestEpisodeId: 'show002_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
      { guildId: 'guild002', id: 'show001', latestEpisodeId: 'show001_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
    ]);
  });

  it('Should only run once an hour, on the hour', async function () {
    await Promise.all([
      spotifyOnInterval({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00')) }),
      spotifyOnInterval({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:01:00')) }),
      spotifyOnInterval({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:15:00')) }),
      spotifyOnInterval({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:30:00')) }),
      spotifyOnInterval({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:45:00')) }),
      spotifyOnInterval({ guilds: [guild001, guild002], date: (new Date('1970-01-01T01:00:00')) }),
      spotifyOnInterval({ guilds: [guild001, guild002], date: (new Date('1970-01-01T01:30:00')) }),
      spotifyOnInterval({ guilds: [guild001, guild002], date: (new Date('1970-01-01T02:00:00')) }),
    ]);

    expect(db.all).toHaveBeenCalledTimes(6);
  });

  it('Should not run for modules that have the module disabled', async function () {
    await db.run(
      'UPDATE modules SET isEnabled = ? WHERE id = ? AND guildId = ?',
      [false, 'spotify', 'guild001']
    );

    await spotifyOnInterval({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00')) });

    expect(console.error).not.toHaveBeenCalled();
    expect(fetchSpotifyShowsMock).toHaveBeenCalledTimes(1);
    expect(fetchSpotifyShowsMock).toHaveBeenCalledWith(['show001']);
    expect(fetchSpotifyShowEpisodesMock).toHaveBeenCalledTimes(1);
    expect(fetchSpotifyShowEpisodesMock).toHaveBeenCalledWith('show001');

    await db.run(
      'UPDATE modules SET isEnabled = ? WHERE id = ? AND guildId = ?',
      [true, 'spotify', 'guild001']
    );
  });

  it('Should handle the database not updating', async function () {
    const dbRun = db.run as jest.MockedFunction<typeof db.run>;
    dbRun.mockRejectedValue('Database error');

    await spotifyOnInterval({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00')) });

    expect(console.error).toHaveBeenCalledWith('Database error');
    expect(await db.all('SELECT * FROM spotifyShows')).toEqual(defaultDatabaseEntries);

    dbRun.mockRestore();
    jest.spyOn(db, 'run');
  });

  it('Should handle a notification not being sent', async function () {
    const notificationChannelSendMock = notificationChannel001.send as jest.MockedFunction<typeof notificationChannel001.send>;
    notificationChannelSendMock.mockRejectedValue('Error');

    await spotifyOnInterval({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00')) });

    expect(console.error).toHaveBeenCalledWith('Error');
    expect(notificationChannel002.send).toHaveBeenCalled();
    expect(await db.all('SELECT * FROM spotifyShows')).toEqual([
      { guildId: 'guild001', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: 'role001' },
      { guildId: 'guild001', id: 'show002', latestEpisodeId: 'show002_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
      { guildId: 'guild002', id: 'show001', latestEpisodeId: 'show001_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
    ]);

    notificationChannelSendMock.mockResolvedValue(undefined as unknown as Message<true>);
  });

  it('Should handle a notification channel not existing', async function () {
    const channelsFetchMock = guild001.channels.fetch as jest.MockedFunction<typeof guild001.channels.fetch>;
    channelsFetchMock.mockRejectedValue('Error');

    await spotifyOnInterval({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00')) });

    expect(console.error).toHaveBeenCalledWith('Error');
    expect(notificationChannel002.send).toHaveBeenCalledTimes(1);
    expect(await db.all('SELECT * FROM spotifyShows')).toEqual([
      { guildId: 'guild001', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: 'role001' },
      { guildId: 'guild001', id: 'show002', latestEpisodeId: 'show002_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
      { guildId: 'guild002', id: 'show001', latestEpisodeId: 'show001_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
    ]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    channelsFetchMock.mockResolvedValue(notificationChannel001);
  });

  it('Should handle a guild not existing', async function () {
    await spotifyOnInterval({ guilds: [guild002], date: (new Date('1970-01-01T00:00:00')) });

    expect(notificationChannel001.send).not.toHaveBeenCalled();
    expect(notificationChannel002.send).toHaveBeenCalled();
    expect(await db.all('SELECT * FROM spotifyShows')).toEqual([
      { guildId: 'guild001', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: 'role001' },
      { guildId: 'guild001', id: 'show002', latestEpisodeId: 'show002_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
      { guildId: 'guild002', id: 'show001', latestEpisodeId: 'show001_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
    ]);
  });

  it('should handle there being no episodes', async function () {
    fetchSpotifyShowEpisodesMock.mockResolvedValue([]);

    await spotifyOnInterval({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00')) });

    expect(notificationChannel001.send).not.toHaveBeenCalled();
    expect(notificationChannel002.send).not.toHaveBeenCalled();
    expect(await db.all('SELECT * FROM spotifyShows')).toEqual(defaultDatabaseEntries);
  });
});