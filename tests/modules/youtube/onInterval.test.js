import database from '../../../database/index.js'

import fetchYouTubeActivitiesMock from '../../../modules/youtube/utils/fetchYouTubeActivities.js'
import youtubeOnInterval from '../../../modules/youtube/onInterval.js'

jest.mock(
  '../../../modules/youtube/utils/fetchYouTubeActivities.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('modules.youtube.onInterval()', function() {
  let db = null

  const notificationChannel001 = {send: jest.fn()}
  const notificationChannel002 = {send: jest.fn()}

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

  beforeAll(async function() {
    db = await database

    await db.migrate()
    
    await db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['youtube', 'guild001', true])
    await db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['youtube', 'guild002', true])

    await db.run(
      'INSERT INTO youtubeChannels (guildId, id, notificationChannelId) VALUES (?,?,?)',
      ['guild001', 'youtubeChannel001', 'channel001']
    ),
    await db.run(
      'INSERT INTO youtubeChannels (guildId, id, notificationChannelId) VALUES (?,?,?)',
      ['guild001', 'youtubeChannel002', 'channel001']
    )
    await db.run(
      'INSERT INTO youtubeChannels (guildId, id, notificationChannelId, notificationRoleId) VALUES (?,?,?,?)',
      ['guild002', 'youtubeChannel001', 'channel001', 'role001']
    )

    jest.spyOn(db, 'all')
    jest.spyOn(db, 'run')

    fetchYouTubeActivitiesMock.mockImplementation(async function({channelId, publishedAfter}) {
      switch (channelId) {
        case 'youtubeChannel001': return [
          {snippet: {channelId, channelTitle: `${channelId}__title`}, contentDetails: {upload: {videoId: 'video001'}}},
        ]
        
        case 'youtubeChannel002': return [
          {snippet: {channelId, channelTitle: `${channelId}__title`}, contentDetails: {upload: {videoId: 'video002'}}},
        ]

        default: return []
      }
    })
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  it('Should announce new activities', async function() {
    await youtubeOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T00:00:25Z')) })

    expect(console.error).not.toHaveBeenCalled()
    expect(fetchYouTubeActivitiesMock).toHaveBeenCalledTimes(2)
    expect(fetchYouTubeActivitiesMock).toHaveBeenNthCalledWith(1, {channelId: 'youtubeChannel001', publishedAfter: '1999-12-31T23:00:00.000Z'})
    expect(fetchYouTubeActivitiesMock).toHaveBeenNthCalledWith(2, {channelId: 'youtubeChannel002', publishedAfter: '1999-12-31T23:00:00.000Z'})
    
    expect(notificationChannel001.send).toHaveBeenCalledTimes(2)
    expect(notificationChannel001.send).toHaveBeenCalledWith({
      content: 'youtubeChannel001__title just posted a new YouTube video\nhttps://www.youtube.com/watch?v=video001'
    })

    expect(notificationChannel002.send).toHaveBeenCalledTimes(1)
    expect(notificationChannel002.send).toHaveBeenCalledWith({
      content: '<@&role001> youtubeChannel001__title just posted a new YouTube video\nhttps://www.youtube.com/watch?v=video001'
    })
  })

  it('Should only run once an hour, on the hour', async function() {
    await Promise.all([
      youtubeOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T00:00:00'))}),
      youtubeOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T00:01:00'))}),
      youtubeOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T00:15:00'))}),
      youtubeOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T00:30:00'))}),
      youtubeOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T00:45:00'))}),
      youtubeOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T01:00:00'))}),
      youtubeOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T01:30:00'))}),
      youtubeOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T02:00:00'))}),
    ])

    expect(db.all).toHaveBeenCalledTimes(6)
  })

  it('Should not run for modules that have the module disabled', async function() {
    await db.run(
      'UPDATE modules SET isEnabled = ? WHERE id = ? AND guildId = ?',
      [false, 'youtube', 'guild001']
    )

    await youtubeOnInterval({guilds: [guild001, guild002], date: (new Date('2000-01-01T00:00:00Z')) })

    expect(console.error).not.toHaveBeenCalled()
    expect(fetchYouTubeActivitiesMock).toHaveBeenCalledTimes(1)
    expect(notificationChannel001.send).not.toHaveBeenCalled()
    expect(notificationChannel002.send).toHaveBeenCalled()

    await db.run(
      'UPDATE modules SET isEnabled = ? WHERE id = ? AND guildId = ?',
      [true, 'youtube', 'guild001']
    )
  })

  it('Should handle a notification not being sent', async function() {
    notificationChannel001.send.mockRejectedValue('Error')
    
    await youtubeOnInterval({guilds: [guild001, guild002], date: (new Date('2020-01-01T00:00:00Z'))})

    expect(console.error).toHaveBeenCalledWith('Error')
    expect(notificationChannel002.send).toHaveBeenCalled()

    notificationChannel001.send.mockResolvedValue()
  })

  it('Should handle a notification channel not existing', async function() {
    guild001.channels.fetch.mockRejectedValue('Error')

    await youtubeOnInterval({guilds: [guild001, guild002], date: (new Date('2020-01-01T00:00:00Z'))})

    expect(console.error).toHaveBeenCalledWith('Error')
    expect(notificationChannel001.send).not.toHaveBeenCalled()
    expect(notificationChannel002.send).toHaveBeenCalled()

    guild001.channels.fetch.mockResolvedValue(notificationChannel001)
  })
  
  it('Should handle a guild not existing', async function() {
    await youtubeOnInterval({guilds: [guild002], date: (new Date('2020-01-01T00:00:00Z'))})

    expect(console.error).not.toHaveBeenCalled()
    expect(notificationChannel001.send).not.toHaveBeenCalled()
    expect(notificationChannel002.send).toHaveBeenCalled()
  })
  
  it('should handle there being no activities', async function() {
    fetchYouTubeActivitiesMock.mockResolvedValue([])

    await youtubeOnInterval({guilds: [guild001, guild002], date: (new Date('2020-01-01T00:00:00Z'))})

    expect(console.error).not.toHaveBeenCalled()
    expect(notificationChannel001.send).not.toHaveBeenCalled()
    expect(notificationChannel002.send).not.toHaveBeenCalled()
  })
})