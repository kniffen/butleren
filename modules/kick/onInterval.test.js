import DiscordJS from 'discord.js'
import database from '../../database/index.js'
import * as getKickChannels from './utils/getKickChannels.js'
import { kickOnInterval } from './onInterval.js'

describe('modules.kick.onInterval()', function() {
  const getKickChannelsSpy = jest.spyOn(getKickChannels, 'getKickChannels');

  let db = null;

  const notificationChannel001 = {send: jest.fn().mockResolvedValue()}
  const notificationChannel002 = {send: jest.fn().mockResolvedValue()}

  const guild001 = {
    id: 'guild001',
    channels: {
      fetch: jest.fn(async () => notificationChannel001)
    }
  }

  const guild002 = {
    id: 'guild002',
    channels: {
      fetch: jest.fn(async () => notificationChannel002)
    }
  }

  async function resetKickChannelsInDatabase() {
    await db.run('DELETE FROM kickChannels');
    await db.run(
      'INSERT INTO kickChannels (guildId, broadcasterUserId, notificationChannelId) VALUES (?,?,?)',
      ['guild001', '111111', 'channel001']
    );
    await db.run(
      'INSERT INTO kickChannels (guildId, broadcasterUserId, notificationChannelId) VALUES (?,?,?)',
      ['guild001', '222222', 'channel001']
    );
    await db.run(
      'INSERT INTO kickChannels (guildId, broadcasterUserId, notificationChannelId) VALUES (?,?,?)',
      ['guild001', '333333', 'channel001']
    );
    await db.run(
      'INSERT INTO kickChannels (guildId, broadcasterUserId, notificationChannelId, notificationRoleId) VALUES (?,?,?,?)',
      ['guild002', '111111', 'channel001', 'role001']
    );
  }

  beforeAll(async function() {
    db = await database;

    await db.migrate();
    await db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['kick', 'guild001', true]);
    await db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['kick', 'guild002', true]);

    jest.spyOn(db, 'all');
    jest.spyOn(db, 'run');

    getKickChannelsSpy.mockResolvedValue([
      {
        broadcaster_user_id: 111111,
        slug: 'kickchannel001',
        stream_title: 'kickChannel001_title',
        stream: {
          is_live: true,
          thumbnail: 'https://kickChannel001_thumbnail',
          viewer_count: 123456,
          start_time: '2000-01-01T00:58:00Z'
        },
        category: {
          name: 'kickChannel001_category'
        }
      },
      {
        broadcaster_user_id: 222222,
        slug: 'kickchannel002',
        stream_title: 'kickChannel002_title',
        stream: {
          is_live: true,
          thumbnail: 'https://kickChannel002_thumbnail',
          viewer_count: 123456,
          start_time: '2000-01-01T00:55:00Z'
        },
        category: {
          name: null
        }
      },
      {
        broadcaster_user_id: 333333,
        slug: 'kickchannel003',
        stream_title: 'kickChannel003_title',
        stream: {
          is_live: true,
          thumbnail: 'https://kickChannel003_thumbnail',
          viewer_count: 123456,
          start_time: '2000-01-01T00:54:00Z'
        },
        category: {
          name: null
        }
      }
    ]);
  });

  beforeEach(async function() {
    await resetKickChannelsInDatabase();

    jest.clearAllMocks();
  });

  afterAll(function() {
    jest.restoreAllMocks();
  });

  it('Should channels that have gone live within the last 5 minutes', async function() {
    const expectedEmbed001 = new DiscordJS.EmbedBuilder();
    expectedEmbed001.setTitle('kickchannel001 is streaming on Kick');
    expectedEmbed001.setURL('https://kick.com/kickchannel001');
    expectedEmbed001.setColor('#53FC18');
    expectedEmbed001.setDescription('**kickChannel001_title**');
    expectedEmbed001.setImage('https://kickChannel001_thumbnail?t=946688400000');
    expectedEmbed001.addFields({name: 'Category', value: 'kickChannel001_category'});

    const expectedEmbed002 = new DiscordJS.EmbedBuilder()
    expectedEmbed002.setTitle('kickchannel002 is streaming on Kick');
    expectedEmbed002.setURL('https://kick.com/kickchannel002');
    expectedEmbed002.setColor('#53FC18');
    expectedEmbed002.setDescription('**kickChannel002_title**');
    expectedEmbed002.setImage('https://kickChannel002_thumbnail?t=946688400000');
    expectedEmbed002.addFields({name: 'Category', value: 'Unknown'});

    await kickOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T01:00:00Z'))});

    expect(console.error).not.toHaveBeenCalled();
    expect(getKickChannelsSpy).toHaveBeenCalledTimes(1);
    expect(getKickChannelsSpy).toHaveBeenCalledWith({broadcasterUserIds: ['111111', '222222', '333333']});

    expect(notificationChannel001.send).toHaveBeenCalledTimes(2);
    expect(notificationChannel001.send).toHaveBeenNthCalledWith(1, {
      content: 'kickchannel001 is live on Kick!',
      embeds: [expectedEmbed001]
    });
    expect(notificationChannel001.send).toHaveBeenNthCalledWith(2, {
      content: 'kickchannel002 is live on Kick!',
      embeds: [expectedEmbed002]
    });

    expect(notificationChannel002.send).toHaveBeenCalledTimes(1);
    expect(notificationChannel002.send).toHaveBeenCalledWith({
      content: '<@&role001> kickchannel001 is live on Kick!',
      embeds: [expectedEmbed001]
    });
  });

  it('Should only run every 5 min', async function() {
    await Promise.all([
      kickOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T00:00:00Z'))}),
      kickOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T00:01:00Z'))}),
      kickOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T00:05:00Z'))}),
      kickOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T00:09:00Z'))}),
      kickOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T00:10:00Z'))}),
      kickOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T00:30:00Z'))}),
      kickOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T00:31:00Z'))}),
      kickOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T00:59:00Z'))}),
    ])

    expect(console.error).not.toHaveBeenCalled();
    expect(db.all).toHaveBeenCalledTimes(8);
  });

  it('Should not run for modules that have the module disabled', async function() {
    await db.run(
      'UPDATE modules SET isEnabled = ? WHERE id = ? AND guildId = ?',
      [false, 'kick', 'guild001']
    );

    await kickOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T01:00:00Z'))});

    expect(console.error).not.toHaveBeenCalled();
    expect(getKickChannelsSpy).toHaveBeenCalledTimes(1);
    expect(getKickChannelsSpy).toHaveBeenCalledWith({broadcasterUserIds: ['111111']});
    expect(notificationChannel001.send).not.toHaveBeenCalled();
    expect(notificationChannel002.send).toHaveBeenCalled();

    await db.run(
      'UPDATE modules SET isEnabled = ? WHERE id = ? AND guildId = ?',
      [true, 'kick', 'guild001']
    );
  });

  it('Should handle a notification not being sent', async function() {
    notificationChannel001.send.mockRejectedValue('Error');

    await kickOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T01:00:00Z'))});

    expect(console.error).toHaveBeenCalledWith('Error');
    expect(notificationChannel002.send).toHaveBeenCalled();

    notificationChannel001.send.mockResolvedValue();
  });

  it('Should handle a notification channel not existing', async function() {
    guild001.channels.fetch.mockRejectedValue('Error');

    await kickOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T01:00:00Z'))});

    expect(console.error).toHaveBeenCalledWith('Error');
    expect(notificationChannel001.send).not.toHaveBeenCalled();
    expect(notificationChannel002.send).toHaveBeenCalled();

    guild001.channels.fetch.mockResolvedValue(notificationChannel001);
  });

  it('Should handle a guild not existing', async function() {
    await kickOnInterval({guilds: [guild002], date: (new Date('2000-01-01T01:00:00Z'))});

    expect(console.error).not.toHaveBeenCalled();
    expect(notificationChannel001.send).not.toHaveBeenCalled();
    expect(notificationChannel002.send).toHaveBeenCalled();
  });

  it('should handle there being no streams', async function() {
    getKickChannelsSpy.mockResolvedValue([]);

    await kickOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T01:00:00Z'))});

    expect(console.error).not.toHaveBeenCalled();
    expect(notificationChannel001.send).not.toHaveBeenCalled();
    expect(notificationChannel002.send).not.toHaveBeenCalled();
  });
});