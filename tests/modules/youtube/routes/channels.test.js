import database from '../../../../database/index.js'
import { callbacks } from '../../../../routes/router.js'
import fetchYouTubeChannelsMock from '../../../../modules/youtube/utils/fetchYouTubeChannels.js'

import '../../../../modules/youtube/routes/channels.js'

jest.mock(
  '../../../../modules/youtube/utils/fetchYouTubeChannels.js',
  () => ({__esModule: true, default: jest.fn()})
)

const path = '/api/youtube/:guild/channels'

describe(path, function() {
  let db = null

  const res = {
    send: jest.fn(),
    sendStatus: jest.fn(),
  }

  async function resetDatabase() {
    await db.run('DELETE FROM youtubeChannels')

    await db.run(
      'INSERT INTO youtubeChannels (guildId, id, notificationChannelId) VALUES (?,?,?)',
      ['guild001', 'youtubeChannel001', 'channel001']
    )
    await db.run(
      'INSERT INTO youtubeChannels (guildId, id, notificationChannelId) VALUES (?,?,?)', 
      ['guild001', 'youtubeChannel002', 'channel002']
    )
    await db.run(
      'INSERT INTO youtubeChannels (guildId, id, notificationChannelId) VALUES (?,?,?)', 
      ['guild002', 'youtubeChannel001', 'channel003']
    )
    await db.run(
      'INSERT INTO youtubeChannels (guildId, id, notificationChannelId) VALUES (?,?,?)', 
      ['guild002', 'youtubeChannel003', 'channel004']
    )
  }

  const defaultDatabaseEntries = [
    {id: 'youtubeChannel001', guildId: 'guild001', notificationChannelId: 'channel001', notificationRoleId: null},
    {id: 'youtubeChannel002', guildId: 'guild001', notificationChannelId: 'channel002', notificationRoleId: null},
    {id: 'youtubeChannel001', guildId: 'guild002', notificationChannelId: 'channel003', notificationRoleId: null},
    {id: 'youtubeChannel003', guildId: 'guild002', notificationChannelId: 'channel004', notificationRoleId: null},
  ]

  beforeAll(async function() {
    db = await database

    await db.migrate()
  })

  beforeEach(async function() {
    await resetDatabase()
    
    jest.clearAllMocks()

    fetchYouTubeChannelsMock.mockImplementation(async ({ids}) => ids.map(id => ({
      id,
      snippet: {
        title:       `${id}_title`,
        description: `${id}_description`,
        customUrl:   'youtubeChannel001' === id ? `${id}_custom_url` : undefined
      }
    })))
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  describe('GET', function() {
    const cb = callbacks.get[path]

    const req = {
      method: 'GET',
      originalUrl: path,
      params: {
        guild: 'guild001'
      }
    }

    it('Should respond with an array of channels for the guild', async function() {
      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).not.toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith([
        {
          id:                    'youtubeChannel001',
          name:                  'youtubeChannel001_title',
          description:           'youtubeChannel001_description',
          url:                   'https://www.youtube.com/c/youtubeChannel001_custom_url',
          notificationChannelId: 'channel001',
          notificationRoleId:    null,
        },
        {
          id:                    'youtubeChannel002',
          name:                  'youtubeChannel002_title',
          description:           'youtubeChannel002_description',
          url:                   'https://www.youtube.com/channel/youtubeChannel002',
          notificationChannelId: 'channel002',
          notificationRoleId:    null,
        },
      ])
    })
    
    it('Should handle there being no channels for the IDs', async function() {
      fetchYouTubeChannelsMock.mockResolvedValue([])

      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).not.toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith([
        {
          id:                    'youtubeChannel001',
          name:                  '',
          description:           '',
          url:                   'https://www.youtube.com/channel/youtubeChannel001',
          notificationChannelId: 'channel001',
          notificationRoleId:    null,
        },
        {
          id:                    'youtubeChannel002',
          name:                  '',
          description:           '',
          url:                   'https://www.youtube.com/channel/youtubeChannel002',
          notificationChannelId: 'channel002',
          notificationRoleId:    null,
        },
      ])
    })

    it('Should respond with a 500 status code if there was an issue reading from the database', async function() {
      jest.spyOn(db, 'all').mockRejectedValue('Database error')

      await cb(req, res)

      expect(console.error).toHaveBeenCalledWith('GET', path, 'Database error')
      expect(res.sendStatus).toHaveBeenCalledWith(500)

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
        id: 'youtubeChannel999',
        notificationChannelId: 'channel999',
        notificationRoleId: 'role999',
      }
    }

    it('Should add an entry to the database', async function() {
      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(201)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual([
        ...defaultDatabaseEntries,
        {id: 'youtubeChannel999', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
      ])
    })
    
    it('Should respond with a 500 status code if there was an issue adding the entry to the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error')
      
      await cb(req, res)
      
      expect(console.error).toHaveBeenCalledWith('POST', path, 'Database error')
      expect(res.sendStatus).toHaveBeenCalledWith(500)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })
    
    it('Should respond with a 409 status code if entry already exists', async function() {
      await cb(req, res)
      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(409)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual([
        ...defaultDatabaseEntries,
        {id: 'youtubeChannel999', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
      ])
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
        id:                    'youtubeChannel001',
        notificationChannelId: 'channel999',
        notificationRoleId:    'role999'
      }
    }

    it('Should update an entry in the database', async function() {
      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual([
        {id: 'youtubeChannel001', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ])
    })

    it('Should respond with a 500 status code if there was an issue updating the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error')
      
      await cb(req, res)
      
      expect(console.error).toHaveBeenCalledWith('PATCH', path, 'Database error')
      expect(res.sendStatus).toHaveBeenCalledWith(500)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })

    it('should ignore unsupported properties', async function() {
      req.body.foo = 'bar'

      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual([
        {id: 'youtubeChannel001', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ])

      delete req.body.foo
    })

    it('Should respond with a 404 status code if the entry does not exist in the database', async function() {
      req.body.id = 'youtubeChannel999'

      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(404)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual(defaultDatabaseEntries)
    })
  })

  describe('DELETE', function() {
    const cb = callbacks.delete[path]

    const req = {
      method: 'DELETE',
      originalUrl: path,
      params: {guild: 'guild001'},
      body: {
        id: 'youtubeChannel001',
      }
    }

    it('Should delete an entry from the database', async function() {
      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual([
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ])
    })

    it('Should respond with a 500 status code if there was an issue updating the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error')
      
      await cb(req, res)
      
      expect(console.error).toHaveBeenCalledWith('DELETE', path, 'Database error')
      expect(res.sendStatus).toHaveBeenCalledWith(500)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })

    it('Should respond with a 404 status code if the entry does not exist in the database', async function() {
      await cb(req, res)
      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(404)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual([
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ])
    })
  })

})