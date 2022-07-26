import database from '../../../../database/index.js'
import { callbacks } from '../../../../routes/router.js'
import fetchSpotifyShowsMock from '../../../../modules/spotify/utils/fetchSpotifyShows.js'

import '../../../../modules/spotify/routes/shows.js'

jest.mock(
  '../../../../modules/spotify/utils/fetchSpotifyShows.js',
  () => ({__esModule: true, default: jest.fn()})
)

const path = '/api/spotify/:guild/shows'

describe(path, function() {
  let db = null

  const res = {
    send: jest.fn(),
    sendStatus: jest.fn()
  }

  beforeAll(async function() {
    db = await database

    await db.migrate()
    await db.run('INSERT INTO spotifyShows (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild001', 'show001', 'channel001'])
    await db.run('INSERT INTO spotifyShows (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild001', 'show002', 'channel002'])
    await db.run('INSERT INTO spotifyShows (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild002', 'show001', 'channel003'])
    await db.run('INSERT INTO spotifyShows (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild002', 'show003', 'channel004'])
  
    fetchSpotifyShowsMock.mockImplementation((ids) => ids.map((id, i) => ({
      id,
      name:        `${id}-name-${i}`,
      publisher:   `${id}-publisher-${i}`,
      description: `${id}-description-${i}`,
      external_urls: {spotify: `${id}-url-${i}`}
    })))
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  describe('GET', function() {
    const cb = callbacks.get[path]

    const req = {
      method: 'GET',
      originalUrl: path,
      params: {guild: 'guild001'}
    }

    it('Should respond with an array of shows for the guild', async function() {
      await cb(req, res)

      expect(res.send).toHaveBeenCalledWith([
        {
          id:                    'show001',
          name:                  'show001-name-0',
          description:           'show001-description-0',
          publisher:             'show001-publisher-0',
          url:                   'show001-url-0',
          notificationChannelId: 'channel001',
          notificationRoleId:    null,
        },
        {
          id:                    'show002',
          name:                  'show002-name-1',
          description:           'show002-description-1',
          publisher:             'show002-publisher-1',
          url:                   'show002-url-1',
          notificationChannelId: 'channel002',
          notificationRoleId:    null,
        }
      ])
    })

    it('Should handle there being no shows for the IDs', async function() {
      fetchSpotifyShowsMock.mockResolvedValue([])

      await cb(req, res)

      expect(res.send).toHaveBeenCalledWith([])
    })

    it('Should respond with a 500 status code if there was an issue reading from the database', async function() {
      jest.spyOn(db, 'all').mockRejectedValue('Database error')

      await cb(req, res)

      expect(res.send).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(500)
      expect(console.error).toHaveBeenCalledWith('GET', path, 'Database error')

      db.all.mockRestore()
    })
  })
  
  describe('POST', function() {
    const cb = callbacks.post[path]

    const req = {
      method: 'POST',
      originalUrl: path,
      params: {guild: 'guild001'},
      body: {
        id:                    'show999',
        notificationChannelId: 'channel001',
        notificationRoleId:    'role001'
      }
    }

    it('Should respond with a 500 status code if there was an issue adding the show to the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error')
      
      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(500)
      expect(console.error).toHaveBeenCalledWith('POST', path, 'Database error')

      db.run.mockRestore()
    })

    it('Should add a show to the database', async function() {
      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(201)
      expect(await db.all('SELECT * FROM spotifyShows')).toEqual([
        {guildId: 'guild001', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: null},
        {guildId: 'guild001', id: 'show002', latestEpisodeId: null, notificationChannelId: 'channel002', notificationRoleId: null},
        {guildId: 'guild002', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel003', notificationRoleId: null},
        {guildId: 'guild002', id: 'show003', latestEpisodeId: null, notificationChannelId: 'channel004', notificationRoleId: null},
        {guildId: 'guild001', id: 'show999', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: 'role001'},
      ])
    })

    it('Should respond with a 409 status code if entry already exists', async function() {
      await cb(req, res)

      expect(res.send).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(409)
    })

    it('Should respond with a 400 status code if there were missing body properties', async function() {
      const req = {
        method: 'POST',
        originalUrl: path,
        params: {guild: 'guild001'},
        body: {}
      }

      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(400)
    })
  })
  
  describe('PATCH', function() {
    const cb = callbacks.patch[path]

    const req = {
      method: 'PATCH',
      originalUrl: path,
      params: {guild: 'guild001'},
      body: {
        id:                    'show001',
        notificationChannelId: 'channel999',
        notificationRoleId:    'role999'
      }
    }

    const expectedEntries = [
      {guildId: 'guild001', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel999', notificationRoleId: 'role999'},
      {guildId: 'guild001', id: 'show002', latestEpisodeId: null, notificationChannelId: 'channel002', notificationRoleId: null},
      {guildId: 'guild002', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel003', notificationRoleId: null},
      {guildId: 'guild002', id: 'show003', latestEpisodeId: null, notificationChannelId: 'channel004', notificationRoleId: null},
      {guildId: 'guild001', id: 'show999', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: 'role001'},
    ]

    it('Should update a show entry in the database', async function() {
      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(await db.all('SELECT * FROM spotifyShows')).toEqual(expectedEntries)
    })

    it('should ignore unsupported properties', async function() {
      req.body.foo = 'bar'

      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(await db.all('SELECT * FROM spotifyShows')).toEqual(expectedEntries)

      delete req.body.foo
    })

    it('Should respond with a 404 status code if the show does not exist in the database', async function() {
      req.body.id = 'show111'

      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(404)
      expect(await db.all('SELECT * FROM spotifyShows')).toEqual(expectedEntries)

      req.body.id = 'show001'
    })


    it('Should respond with a 500 status code if there was an issue updating the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error')
      
      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(500)
      expect(console.error).toHaveBeenCalledWith('PATCH', path, 'Database error')
      expect(await db.all('SELECT * FROM spotifyShows')).toEqual(expectedEntries)

      db.run.mockRestore()
    })
  })
  
  describe('DELETE', function() {
    const cb = callbacks.delete[path]

    const req = {
      method: 'DELETE',
      originalUrl: path,
      params: {guild: 'guild001'},
      body: {id: 'show001'}
    }

    const expectedEntries = [
      {guildId: 'guild001', id: 'show002', latestEpisodeId: null, notificationChannelId: 'channel002', notificationRoleId: null},
      {guildId: 'guild002', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel003', notificationRoleId: null},
      {guildId: 'guild002', id: 'show003', latestEpisodeId: null, notificationChannelId: 'channel004', notificationRoleId: null},
      {guildId: 'guild001', id: 'show999', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: 'role001'},
    ]

    it('Should respond with a 500 status code if there was an issue updating the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error')
      
      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(500)
      expect(console.error).toHaveBeenCalledWith('DELETE', path, 'Database error')

      db.run.mockRestore()
    })

    it('Should delete a show entry in the database', async function() {
      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(await db.all('SELECT * FROM spotifyShows')).toEqual(expectedEntries)
    })

    it('Should respond with a 404 status code if the show does not exist in the database', async function() {
      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(404)
      expect(await db.all('SELECT * FROM spotifyShows')).toEqual(expectedEntries)
    })
  })
})