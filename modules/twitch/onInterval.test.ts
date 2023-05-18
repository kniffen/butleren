import DiscordJS, { Guild } from 'discord.js';

import database from '../../database';
import fetchTwitchStreams from './utils/fetchTwitchStreams';
import twitchOnInterval from './onInterval';

jest.mock(
  './utils/fetchTwitchStreams',
  () => ({ __esModule: true, default: jest.fn() })
);

describe('modules.twitch.onInterval()', function () {
  const fetchTwitchStreamsMock = fetchTwitchStreams as jest.MockedFunction<typeof fetchTwitchStreams>;
  let db: Awaited<typeof database>;

  const notificationChannel001 = { send: jest.fn().mockResolvedValue(undefined) };
  const notificationChannel002 = { send: jest.fn().mockResolvedValue(undefined) };

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

  async function resetTwitchChannelsInDatabase() {
    await db.run('DELETE FROM twitchChannels');
    await db.run(
      'INSERT INTO twitchChannels (guildId, id, notificationChannelId) VALUES (?,?,?)',
      ['guild001', 'twitchChannel001', 'channel001']
    );
    await db.run(
      'INSERT INTO twitchChannels (guildId, id, notificationChannelId) VALUES (?,?,?)',
      ['guild001', 'twitchChannel002', 'channel001']
    );
    await db.run(
      'INSERT INTO twitchChannels (guildId, id, notificationChannelId) VALUES (?,?,?)',
      ['guild001', 'twitchChannel003', 'channel001']
    );
    await db.run(
      'INSERT INTO twitchChannels (guildId, id, notificationChannelId, notificationRoleId) VALUES (?,?,?,?)',
      ['guild002', 'twitchChannel001', 'channel001', 'role001']
    );
  }

  beforeAll(async function () {
    db = await database;

    await db.migrate();
    await db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['twitch', 'guild001', true]);
    await db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['twitch', 'guild002', true]);

    jest.spyOn(db, 'all');
    jest.spyOn(db, 'run');

    fetchTwitchStreamsMock.mockResolvedValue([
      {
        user_id: 'twitchChannel001',
        user_login: 'twitchChannel001_login',
        user_name: 'twitchChannel001_name',
        title: 'twitchChannel001_title',
        game_name: 'twitchChannel001_category',
        thumbnail_url: 'https://twitchChannel001_thumbnail_{width}x{height}.ext',
        started_at: '2000-01-01T00:58:00Z'
      },
      {
        user_id: 'twitchChannel002',
        user_login: 'twitchChannel002_login',
        user_name: 'twitchChannel002_name',
        title: 'twitchChannel002_title',
        thumbnail_url: 'https://twitchChannel002_thumbnail_{width}x{height}.ext',
        started_at: '2000-01-01T00:55:00Z'
      },
      {
        user_id: 'twitchChannel003',
        user_login: 'twitchChannel003_login',
        user_name: 'twitchChannel003_name',
        title: 'twitchChannel003_title',
        thumbnail_url: 'https://twitchChannel003_thumbnail_{width}x{height}.ext',
        started_at: '2000-01-01T00:54:00Z'
      }
    ] as TwitchStreams['data']);
  });

  beforeEach(async function () {
    await resetTwitchChannelsInDatabase();

    jest.clearAllMocks();
  });

  afterAll(function () {
    jest.restoreAllMocks();
  });

  it('Should channels that have gone live within the last 5 minutes', async function () {
    const expectedEmbed001 = new DiscordJS.EmbedBuilder();
    expectedEmbed001.setTitle('twitchChannel001_name is streaming on Twitch');
    expectedEmbed001.setURL('https://twitch.tv/twitchChannel001_login');
    expectedEmbed001.setColor('#9146FF');
    expectedEmbed001.setDescription('**twitchChannel001_title**');
    expectedEmbed001.setImage('https://twitchChannel001_thumbnail_400x225.ext?t=946688400000');
    expectedEmbed001.addFields({ name: 'Category', value: 'twitchChannel001_category' });

    const expectedEmbed002 = new DiscordJS.EmbedBuilder();
    expectedEmbed002.setTitle('twitchChannel002_name is streaming on Twitch');
    expectedEmbed002.setURL('https://twitch.tv/twitchChannel002_login');
    expectedEmbed002.setColor('#9146FF');
    expectedEmbed002.setDescription('**twitchChannel002_title**');
    expectedEmbed002.setImage('https://twitchChannel002_thumbnail_400x225.ext?t=946688400000');
    expectedEmbed002.addFields({ name: 'Category', value: 'Unknown' });

    await twitchOnInterval({ guilds: [guild001, guild002], date: (new Date('2000-01-01T01:00:00Z')) });

    expect(console.error).not.toHaveBeenCalled();
    expect(fetchTwitchStreamsMock).toHaveBeenCalledTimes(1);
    expect(fetchTwitchStreamsMock).toHaveBeenCalledWith({
      ids: ['twitchChannel001', 'twitchChannel002', 'twitchChannel003'],
      usernames: []
    });

    expect(notificationChannel001.send).toHaveBeenCalledTimes(2);
    expect(notificationChannel001.send).toHaveBeenNthCalledWith(1, {
      content: 'twitchChannel001_name is live!',
      embeds: [expectedEmbed001]
    });
    expect(notificationChannel001.send).toHaveBeenNthCalledWith(2, {
      content: 'twitchChannel002_name is live!',
      embeds: [expectedEmbed002]
    });

    expect(notificationChannel002.send).toHaveBeenCalledTimes(1);
    expect(notificationChannel002.send).toHaveBeenCalledWith({
      content: '<@&role001> twitchChannel001_name is live!',
      embeds: [expectedEmbed001]
    });
  });

  it('Should only run every 5 min', async function () {
    await Promise.all([
      twitchOnInterval({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:00:00Z')) }),
      twitchOnInterval({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:01:00Z')) }),
      twitchOnInterval({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:05:00Z')) }),
      twitchOnInterval({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:09:00Z')) }),
      twitchOnInterval({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:10:00Z')) }),
      twitchOnInterval({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:30:00Z')) }),
      twitchOnInterval({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:31:00Z')) }),
      twitchOnInterval({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:59:00Z')) }),
    ]);

    expect(console.error).not.toHaveBeenCalled();
    expect(db.all).toHaveBeenCalledTimes(8);
  });

  it('Should not run for modules that have the module disabled', async function () {
    await db.run(
      'UPDATE modules SET isEnabled = ? WHERE id = ? AND guildId = ?',
      [false, 'twitch', 'guild001']
    );

    await twitchOnInterval({ guilds: [guild001, guild002], date: (new Date('2000-01-01T01:00:00Z')) });

    expect(console.error).not.toHaveBeenCalled();
    expect(fetchTwitchStreamsMock).toHaveBeenCalledTimes(1);
    expect(fetchTwitchStreamsMock).toHaveBeenCalledWith({ ids: ['twitchChannel001'], usernames: [] });
    expect(notificationChannel001.send).not.toHaveBeenCalled();
    expect(notificationChannel002.send).toHaveBeenCalled();

    await db.run(
      'UPDATE modules SET isEnabled = ? WHERE id = ? AND guildId = ?',
      [true, 'twitch', 'guild001']
    );
  });

  it('Should handle a notification not being sent', async function () {
    notificationChannel001.send.mockRejectedValue('Error');

    await twitchOnInterval({ guilds: [guild001, guild002], date: (new Date('2000-01-01T01:00:00Z')) });

    expect(console.error).toHaveBeenCalledWith('Error');
    expect(notificationChannel002.send).toHaveBeenCalled();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    notificationChannel001.send.mockResolvedValue();
  });

  it('Should handle a notification channel not existing', async function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    guild001.channels.fetch.mockRejectedValue('Error');

    await twitchOnInterval({ guilds: [guild001, guild002], date: (new Date('2000-01-01T01:00:00Z')) });

    expect(console.error).toHaveBeenCalledWith('Error');
    expect(notificationChannel001.send).not.toHaveBeenCalled();
    expect(notificationChannel002.send).toHaveBeenCalled();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    guild001.channels.fetch.mockResolvedValue(notificationChannel001);
  });

  it('Should handle a guild not existing', async function () {
    await twitchOnInterval({ guilds: [guild002], date: (new Date('2000-01-01T01:00:00Z')) });

    expect(console.error).not.toHaveBeenCalled();
    expect(notificationChannel001.send).not.toHaveBeenCalled();
    expect(notificationChannel002.send).toHaveBeenCalled();
  });

  it('should handle there being no streams', async function () {
    fetchTwitchStreamsMock.mockResolvedValue([]);

    await twitchOnInterval({ guilds: [guild001, guild002], date: (new Date('2000-01-01T01:00:00Z')) });

    expect(console.error).not.toHaveBeenCalled();
    expect(notificationChannel001.send).not.toHaveBeenCalled();
    expect(notificationChannel002.send).not.toHaveBeenCalled();
  });
});