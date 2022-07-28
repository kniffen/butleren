import database from '../../../database/index.js'

import fetchTwitterUsersMock from '../../../modules/twitter/utils/fetchTwitterUsers.js'
import fetchTwitterUserTweetsMock from '../../../modules/twitter/utils/fetchTwitterUserTweets.js'
import twitterOnInterval from '../../../modules/twitter/onInterval.js'

jest.mock(
  '../../../modules/twitter/utils/fetchTwitterUsers.js',
  () => ({__esModule: true, default: jest.fn()})
)

jest.mock(
  '../../../modules/twitter/utils/fetchTwitterUserTweets.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('modules.twitter.onInterval()', function() {
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
    await db.run(
      'INSERT INTO twitterUsers (guildId, id, notificationChannelId) VALUES (?,?,?)',
      ['guild001', 'twitterUser001', 'channel001']
    ),
    await db.run(
      'INSERT INTO twitterUsers (guildId, id, notificationChannelId) VALUES (?,?,?)',
      ['guild001', 'twitterUser002', 'channel001']
    )
    await db.run(
      'INSERT INTO twitterUsers (guildId, id, notificationChannelId, notificationRoleId) VALUES (?,?,?,?)',
      ['guild002', 'twitterUser001', 'channel001', 'role001']
    )

    jest.spyOn(db, 'all')
    jest.spyOn(db, 'run')

    fetchTwitterUsersMock.mockResolvedValue([
      {id: 'twitterUser001', name: 'twitterUser001_name', username: 'twitterUser001_username'},
      {id: 'twitterUser002', name: 'twitterUser002_name', username: 'twitterUser002_username'},
    ])

    fetchTwitterUserTweetsMock.mockImplementation(async function(id) {
      if ('twitterUser001' === id) return [
        {id: 'tweet001', created_at: '1970-01-01T00:00:00Z'},
        {id: 'tweet002', created_at: '1970-01-01T00:45:00Z'},
      ]

      if ('twitterUser002' === id) return [
        {id: 'tweet003', created_at: '1970-01-01T00:30:00Z'},
        {id: 'tweet004', created_at: '1970-01-01T00:15:00Z'},
      ]

      return []
    })
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  it('Should announce new tweets', async function() {
    await twitterOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T01:00:00Z'))})

    expect(console.error).not.toHaveBeenCalled()
    expect(fetchTwitterUsersMock).toHaveBeenCalledTimes(1)
    expect(fetchTwitterUsersMock).toHaveBeenCalledWith({ids: ['twitterUser001', 'twitterUser002']})
    expect(fetchTwitterUserTweetsMock).toHaveBeenCalledTimes(2)
    expect(fetchTwitterUserTweetsMock).toHaveBeenNthCalledWith(1, 'twitterUser001')
    expect(fetchTwitterUserTweetsMock).toHaveBeenNthCalledWith(2, 'twitterUser002')
    expect(notificationChannel001.send).toHaveBeenCalledWith({
      content: 'twitterUser001_name just tweeted\nhttps://twitter.com/twitterUser001_username/status/tweet002'
    })
    expect(notificationChannel002.send).toHaveBeenCalledWith({
      content: '<@&role001> twitterUser001_name just tweeted\nhttps://twitter.com/twitterUser001_username/status/tweet002'
    })
  })

  it('Should only run every half hour, on the half hour or hour mark', async function() {
    await Promise.all([
      twitterOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00Z'))}),
      twitterOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T00:01:00Z'))}),
      twitterOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T00:15:00Z'))}),
      twitterOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T00:30:00Z'))}),
      twitterOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T00:45:00Z'))}),
      twitterOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T01:00:00Z'))}),
      twitterOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T01:30:00Z'))}),
      twitterOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T02:00:00Z'))}),
    ])

    expect(db.all).toHaveBeenCalledTimes(5)
  })
  
  it('Should handle a notification not being sent', async function() {
    notificationChannel001.send.mockRejectedValue('Error')
    
    await twitterOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T01:00:00Z'))})

    expect(console.error).toHaveBeenCalledWith('Error')
    expect(notificationChannel002.send).toHaveBeenCalled()

    notificationChannel001.send.mockResolvedValue()
  })

  it('Should handle a notification channel not existing', async function() {
    guild001.channels.fetch.mockRejectedValue('Error')

    await twitterOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T01:00:00Z'))})

    expect(console.error).toHaveBeenCalledWith('Error')
    expect(notificationChannel001.send).not.toHaveBeenCalled()
    expect(notificationChannel002.send).toHaveBeenCalled()

    guild001.channels.fetch.mockResolvedValue(notificationChannel001)
  })

  it('Should handle a guild not existing', async function() {
    await twitterOnInterval({guilds: [guild002], date: (new Date('1970-01-01T01:00:00Z'))})

    expect(console.error).not.toHaveBeenCalled()
    expect(notificationChannel001.send).not.toHaveBeenCalled()
    expect(notificationChannel002.send).toHaveBeenCalled()
  })

  it('should handle there being no tweets', async function() {
    fetchTwitterUserTweetsMock.mockResolvedValue([])

    await twitterOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T01:00:00Z'))})

    expect(notificationChannel001.send).not.toHaveBeenCalled()
    expect(notificationChannel002.send).not.toHaveBeenCalled()
  })

  it('should handle a twitter user not existing', async function() {
    fetchTwitterUsersMock.mockResolvedValue([])

    await twitterOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T01:00:00Z'))})

    expect(fetchTwitterUserTweetsMock).not.toHaveBeenCalled()
    expect(notificationChannel001.send).not.toHaveBeenCalled()
    expect(notificationChannel002.send).not.toHaveBeenCalled()
  })
})