import database from '../../database/index.js'

import fetchTwitterUsersMock from './utils/fetchTwitterUsers.js'
import fetchTwitterUserTweetsMock from './utils/fetchTwitterUserTweets.js'
import twitterOnInterval from './onInterval.js'

jest.mock(
  './utils/fetchTwitterUsers.js',
  () => ({__esModule: true, default: jest.fn()})
)

jest.mock(
  './utils/fetchTwitterUserTweets.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('modules.twitter.onInterval()', function() {
  let db = null

  const notificationChannel = {send: jest.fn()}

  const guild = {
    id: 'guild001',
    channels: {
      fetch: jest.fn()
    }
  }

  beforeAll(async function() {
    db = await database

    await db.migrate()

    jest.spyOn(db, 'all')
    jest.spyOn(db, 'run')
  })

  beforeEach(async function() {
    await db.run('DELETE FROM modules')
    await db.run('DELETE FROM twitterUsers')
    
    await db.run(
      'INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)',
      ['twitter', 'guild001', true]
    )

    await db.run(
      'INSERT INTO twitterUsers (guildId, id, notificationChannelId) VALUES (?,?,?)',
      ['guild001', 'twitterUser001', 'channel001']
    )

    fetchTwitterUsersMock.mockImplementation(
      async ({ ids }) => ids.map(id => ({id, name: `${id}_name`, username: `${id}_username`}))
    )

    fetchTwitterUserTweetsMock.mockResolvedValue([
      {id: 'tweet001', created_at: '1970-01-01T00:45:00Z'},
      {id: 'tweet002', created_at: '1970-01-01T00:15:00Z'},
    ])

    guild.channels.fetch.mockResolvedValue(notificationChannel)
    notificationChannel.send.mockResolvedValue()

    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  it('Should announce a new tweet', async function() {
    await db.run(
      'INSERT INTO twitterUsers (guildId, id, notificationChannelId) VALUES (?,?,?)',
      ['guild001', 'twitterUser002', 'channel001']
    )

    await twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T01:00:00Z'))})

    expect(console.error).not.toHaveBeenCalled()

    expect(fetchTwitterUsersMock).toHaveBeenCalledWith({ids: ['twitterUser001', 'twitterUser002']})
    
    expect(fetchTwitterUserTweetsMock).toHaveBeenCalledTimes(2)
    expect(fetchTwitterUserTweetsMock).toHaveBeenCalledWith('twitterUser001')
    expect(fetchTwitterUserTweetsMock).toHaveBeenCalledWith('twitterUser002')
    
    expect(notificationChannel.send).toHaveBeenCalledTimes(2)
    expect(notificationChannel.send).toHaveBeenCalledWith({
      content: 'twitterUser001_name just tweeted\nhttps://twitter.com/twitterUser001_username/status/tweet001'
    })
    expect(notificationChannel.send).toHaveBeenCalledWith({
      content: 'twitterUser002_name just tweeted\nhttps://twitter.com/twitterUser002_username/status/tweet001'
    })
  })

  it('Should announce a new tweets from multiple handles', async function() {
    await twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T01:00:00Z'))})

    expect(console.error).not.toHaveBeenCalled()
    expect(fetchTwitterUsersMock).toHaveBeenCalledWith({ids: ['twitterUser001']})
    expect(fetchTwitterUserTweetsMock).toHaveBeenCalledWith('twitterUser001')
    expect(notificationChannel.send).toHaveBeenCalledWith({
      content: 'twitterUser001_name just tweeted\nhttps://twitter.com/twitterUser001_username/status/tweet001'
    })
  })

  it('Should @mention a notification role', async function() {
    await db.run('UPDATE twitterUsers SET notificationRoleId = ? WHERE id = ?',
      ['role001', 'twitterUser001']
    )

    await twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T01:00:00Z'))})

    expect(console.error).not.toHaveBeenCalled()
    expect(fetchTwitterUsersMock).toHaveBeenCalledWith({ids: ['twitterUser001']})
    expect(fetchTwitterUserTweetsMock).toHaveBeenCalledWith('twitterUser001')
    expect(notificationChannel.send).toHaveBeenCalledWith({
      content: '<@&role001> twitterUser001_name just tweeted\nhttps://twitter.com/twitterUser001_username/status/tweet001'
    })
  })

  it('Should handle a notification not being sent', async function() {
    notificationChannel.send.mockRejectedValue('Error')
    
    await twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T01:00:00Z'))})
    
    expect(console.error).toHaveBeenCalledWith('Error')
    expect(fetchTwitterUsersMock).toHaveBeenCalledWith({ids: ['twitterUser001']})
    expect(fetchTwitterUserTweetsMock).toHaveBeenCalledWith('twitterUser001')
  })

  it('Should only run every half hour, on the half hour or hour mark', async function() {
    await Promise.all([
      twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T00:00:00Z'))}),
      twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T00:30:00Z'))}),
      twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T01:00:00Z'))}),
      twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T01:30:00Z'))}),
      twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T02:00:00Z'))}),
    ])

    await Promise.all([
      twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T00:01:00Z'))}),
      twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T00:15:00Z'))}),
      twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T00:45:00Z'))}),
    ])

    expect(db.all).toHaveBeenCalledTimes(10)
  })

  it('Should not run for guilds that have the module disabled', async function() {
    await db.run(
      'UPDATE modules SET isEnabled = ? WHERE id = ? AND guildId = ?',
      [false, 'twitter', 'guild001']
    )

    await twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T01:00:00Z'))})

    expect(console.error).not.toHaveBeenCalled()
    expect(fetchTwitterUsersMock).not.toHaveBeenCalled()
    expect(fetchTwitterUserTweetsMock).not.toHaveBeenCalled()
    expect(notificationChannel.send).not.toHaveBeenCalled()
  })

  it('Should handle a notification channel not existing', async function() {
    guild.channels.fetch.mockRejectedValue('Error')

    await twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T01:00:00Z'))})

    expect(console.error).toHaveBeenCalledWith('Error')
    expect(fetchTwitterUsersMock).toHaveBeenCalled()
    expect(fetchTwitterUserTweetsMock).toHaveBeenCalled()
    expect(notificationChannel.send).not.toHaveBeenCalled()
  })

  it('Should handle a guild not existing', async function() {
    await db.run(
      'UPDATE twitterUsers SET guildId = ? WHERE id = ?',
      ['guild999', 'twitterUser001']
    )
    
    await twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T01:00:00Z'))})

    expect(console.error).not.toHaveBeenCalled()
    expect(fetchTwitterUsersMock).not.toHaveBeenCalled()
    expect(fetchTwitterUserTweetsMock).not.toHaveBeenCalled()
    expect(notificationChannel.send).not.toHaveBeenCalled()
  })

  it('should handle there being no tweets', async function() {
    fetchTwitterUserTweetsMock.mockResolvedValue([])

    await twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T01:00:00Z'))})

    expect(console.error).not.toHaveBeenCalled()
    expect(fetchTwitterUsersMock).toHaveBeenCalledWith({ids: ['twitterUser001']})
    expect(fetchTwitterUserTweetsMock).toHaveBeenCalledWith('twitterUser001')
    expect(notificationChannel.send).not.toHaveBeenCalled()
  })

  it('should handle a twitter user not existing', async function() {
    await db.run(
      'INSERT INTO twitterUsers (guildId, id, notificationChannelId) VALUES (?,?,?)',
      ['guild001', 'twitterUser002', 'channel001']
    )

    fetchTwitterUsersMock.mockImplementation(async ({ids}) => 
      ids.filter(id => 'twitterUser002' !== id).map(id => ({id, name: `${id}_name`, username: `${id}_username`}))
    )

    await twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T01:00:00Z'))})

    expect(console.error).not.toHaveBeenCalled()
    
    expect(fetchTwitterUsersMock).toHaveBeenCalledWith({ids: ['twitterUser001', 'twitterUser002']})
    
    expect(fetchTwitterUserTweetsMock).toHaveBeenCalledTimes(1)
    expect(fetchTwitterUserTweetsMock).toHaveBeenCalledWith('twitterUser001')
    
    expect(notificationChannel.send).toHaveBeenCalledTimes(1)
    expect(notificationChannel.send).toHaveBeenCalledWith({
      content: 'twitterUser001_name just tweeted\nhttps://twitter.com/twitterUser001_username/status/tweet001'
    })
  })
  
  describe('multiple tweets', function() {
    beforeEach(function() {
      fetchTwitterUserTweetsMock.mockResolvedValue([
        {id: 'tweet001', created_at: '1970-01-01T00:55:00Z'},
        {id: 'tweet002', created_at: '1970-01-01T00:45:00Z'},
        {id: 'tweet003', created_at: '1970-01-01T00:15:00Z'},
      ])
    })

    it('should group multiple tweets', async function() {
      await twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T01:00:00Z'))})

      expect(console.error).not.toHaveBeenCalled()
      
      expect(fetchTwitterUsersMock).toHaveBeenCalledWith({ids: ['twitterUser001']})
      
      expect(fetchTwitterUserTweetsMock).toHaveBeenCalledTimes(1)
      expect(fetchTwitterUserTweetsMock).toHaveBeenCalledWith('twitterUser001')
      
      expect(notificationChannel.send).toHaveBeenCalledTimes(1)
      expect(notificationChannel.send).toHaveBeenCalledWith({
        content: 'twitterUser001_name just posted some tweets\n'
              + 'https://twitter.com/twitterUser001_username/status/tweet001\n'
              + 'https://twitter.com/twitterUser001_username/status/tweet002'
      })
    })

    it('Should @mention a notification role', async function() {
      await db.run('UPDATE twitterUsers SET notificationRoleId = ? WHERE id = ?',
        ['role001', 'twitterUser001']
      )

      await twitterOnInterval({guilds: [guild], date: (new Date('1970-01-01T01:00:00Z'))})

      expect(console.error).not.toHaveBeenCalled()

      expect(fetchTwitterUsersMock).toHaveBeenCalledWith({ids: ['twitterUser001']})
      
      expect(fetchTwitterUserTweetsMock).toHaveBeenCalledTimes(1)
      expect(fetchTwitterUserTweetsMock).toHaveBeenCalledWith('twitterUser001')
      
      expect(notificationChannel.send).toHaveBeenCalledTimes(1)
      expect(notificationChannel.send).toHaveBeenCalledWith({
        content: '<@&role001> twitterUser001_name just posted some tweets\n'
              + 'https://twitter.com/twitterUser001_username/status/tweet001\n'
              + 'https://twitter.com/twitterUser001_username/status/tweet002'
      })
    })
  })
})