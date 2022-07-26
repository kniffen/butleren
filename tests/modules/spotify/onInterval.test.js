import { Collection } from 'discord.js'

import database from '../../../database/index.js'

import spotifyOnInterval from '../../../modules/spotify/onInterval.js'
import fetchSpotifyShowEpisodesMock from '../../../modules/spotify/utils/fetchSpotifyShowEpisodes.js'

jest.mock(
  '../../../modules/spotify/utils/fetchSpotifyShowEpisodes.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('modules.spotify.onInterval()', function() {
  let db = null

  const notificationChannel = {
    send: jest.fn()
  }

  const guild001 = {
    id: 'guild001',
    channels: {
      fetch: jest.fn(async () => notificationChannel)
    }
  }
  
  const guild002 = {
    id: 'guild002',
    channels: {
      fetch: jest.fn(async () => notificationChannel)
    }
  }

  const expectedEntriesFailure = [
    {guildId: 'guild001', id: 'show001', latestEpisodeId: null,         notificationChannelId: 'channel001', notificationRoleId: 'role001'},
    {guildId: 'guild001', id: 'show002', latestEpisodeId: 'episode003', notificationChannelId: 'channel001', notificationRoleId: null},
    {guildId: 'guild002', id: 'show001', latestEpisodeId: 'episode001', notificationChannelId: 'channel001', notificationRoleId: null},
  ]

  const expectedEntriesSuccess = [
    {guildId: 'guild001', id: 'show001', latestEpisodeId: 'episode003', notificationChannelId: 'channel001', notificationRoleId: 'role001'},
    {guildId: 'guild001', id: 'show002', latestEpisodeId: 'episode003', notificationChannelId: 'channel001', notificationRoleId: null},
    {guildId: 'guild002', id: 'show001', latestEpisodeId: 'episode003', notificationChannelId: 'channel001', notificationRoleId: null},
  ]

  async function resetShowsInDatabase() {
    await db.run('DELETE FROM spotifyShows')

    await db.run(
      'INSERT INTO spotifyShows (guildId, id, latestEpisodeId, notificationChannelId, notificationRoleId) VALUES (?,?,?,?,?)',
      ['guild001', 'show001', null, 'channel001', 'role001']
    )
    await db.run(
      'INSERT INTO spotifyShows (guildId, id, latestEpisodeId, notificationChannelId) VALUES (?,?,?,?)',
      ['guild001', 'show002', 'episode003', 'channel001']
    )
    await db.run(
      'INSERT INTO spotifyShows (guildId, id, latestEpisodeId, notificationChannelId) VALUES (?,?,?,?)',
      ['guild002', 'show001', 'episode001', 'channel001']
    )
  }
  
  beforeAll(async function() {
    db = await database

    await db.migrate()
    
    fetchSpotifyShowEpisodesMock.mockImplementation(async (id) => [
      {id: 'episode003', external_urls: {spotify: 'episode003_url'}, show: {name: `${id}_name`}},
      {id: 'episode002', external_urls: {spotify: 'episode002_url'}, show: {name: `${id}_name`}},
      {id: 'episode001', external_urls: {spotify: 'episode001_url'}, show: {name: `${id}_name`}},
    ])

    jest.spyOn(db, 'all')
    jest.spyOn(db, 'run')
  })

  beforeEach(async function() {
    await resetShowsInDatabase()
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  it('Should announce new show episodes', async function() {
    await spotifyOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00'))})
    await spotifyOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T01:00:00'))})

    expect(fetchSpotifyShowEpisodesMock).toHaveBeenCalledTimes(4)
    expect(fetchSpotifyShowEpisodesMock).toHaveBeenNthCalledWith(1, 'show001')
    expect(fetchSpotifyShowEpisodesMock).toHaveBeenNthCalledWith(2, 'show002')

    expect(notificationChannel.send).toHaveBeenCalledTimes(2)
    expect(notificationChannel.send).toHaveBeenNthCalledWith(1, {
      content: '<@&role001> A new episode from show001_name is out!\nepisode003_url'
    })
    expect(notificationChannel.send).toHaveBeenNthCalledWith(2, {
      content: 'A new episode from show001_name is out!\nepisode003_url'
    })

    expect(db.run).toHaveBeenCalledTimes(2)
    expect(await db.all('SELECT * FROM spotifyShows')).toEqual(expectedEntriesSuccess)
  })

  it('Should only run once an hour, on the hour', async function() {
    await Promise.all([
      spotifyOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00'))}),
      spotifyOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T00:01:00'))}),
      spotifyOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T00:15:00'))}),
      spotifyOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T00:30:00'))}),
      spotifyOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T00:45:00'))}),
      spotifyOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T01:00:00'))}),
      spotifyOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T01:30:00'))}),
      spotifyOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T02:00:00'))}),
    ])

    expect(db.all).toHaveBeenCalledTimes(3)
  })

  it('Should handle the database not updating', async function() {
    db.run.mockRejectedValue('Database error')

    await spotifyOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00'))})

    expect(console.error).toHaveBeenCalledWith('Database error')
    expect(await db.all('SELECT * FROM spotifyShows')).toEqual(expectedEntriesFailure)

    db.run.mockRestore()
    jest.spyOn(db, 'run')
  })

  it('Should handle the notification not being sent', async function() {
    notificationChannel.send.mockRejectedValue('Error')
    
    await spotifyOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00'))})

    expect(console.error).toHaveBeenCalledWith('Error')
    expect(await db.all('SELECT * FROM spotifyShows')).toEqual(expectedEntriesFailure)

    notificationChannel.send.mockResolvedValue()
  })

  it('Should handle a notification channel not existing', async function() {
    guild001.channels.fetch.mockRejectedValue('Error')
    
    await spotifyOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00'))})

    expect(console.error).toHaveBeenCalledWith('Error')
    expect(notificationChannel.send).toHaveBeenCalledTimes(1)
    expect(await db.all('SELECT * FROM spotifyShows')).toEqual([
      {guildId: 'guild001', id: 'show001', latestEpisodeId: null,         notificationChannelId: 'channel001', notificationRoleId: 'role001'},
      {guildId: 'guild001', id: 'show002', latestEpisodeId: 'episode003', notificationChannelId: 'channel001', notificationRoleId: null},
      {guildId: 'guild002', id: 'show001', latestEpisodeId: 'episode003', notificationChannelId: 'channel001', notificationRoleId: null},  
    ])

    guild001.channels.fetch.mockResolvedValue(notificationChannel)
  })

  it('Should handle a guild not existing', async function() {
    await spotifyOnInterval({guilds: [guild002], date: (new Date('1970-01-01T00:00:00'))})

    expect(notificationChannel.send).toHaveBeenCalledTimes(1)
    expect(await db.all('SELECT * FROM spotifyShows')).toEqual([
      {guildId: 'guild001', id: 'show001', latestEpisodeId: null,         notificationChannelId: 'channel001', notificationRoleId: 'role001'},
      {guildId: 'guild001', id: 'show002', latestEpisodeId: 'episode003', notificationChannelId: 'channel001', notificationRoleId: null},
      {guildId: 'guild002', id: 'show001', latestEpisodeId: 'episode003', notificationChannelId: 'channel001', notificationRoleId: null},  
    ])
  })

  it('should handle there being no episodes', async function() {
    fetchSpotifyShowEpisodesMock.mockResolvedValue([])

    await spotifyOnInterval({guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00'))})

    expect(notificationChannel.send).toHaveBeenCalledTimes(0)
    expect(await db.all('SELECT * FROM spotifyShows')).toEqual(expectedEntriesFailure)
  })
})