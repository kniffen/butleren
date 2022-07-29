import database from '../../../../database/index.js'
import { callbacks } from '../../../../routes/router.js'
import fetchTwitchUsersMock from '../../../../modules/twitch/utils/fetchTwitchUsers.js'

import '../../../../modules/twitch/routes/channels.js'

jest.mock(
  '../../../../modules/twitch/utils/fetchTwitchUsers.js',
  () => ({__esModule: true, default: jest.fn()})
)

const path = '/api/twitch/:guild/channels'

describe(path, function() {
  let db = null

  const res = {
    send: jest.fn(),
    sendStatus: jest.fn()
  }

  async function resetTwitchChannelsInDatabase() {
    await db.run('DELETE FROM twitchChannels')

    await db.run(
      'INSERT INTO twitchChannels (guildId, id, notificationChannelId) VALUES (?,?,?)',
      ['guild001', 'twitchChannel001', 'channel001']
    )
    await db.run(
      'INSERT INTO twitchChannels (guildId, id, notificationChannelId) VALUES (?,?,?)', 
      ['guild001', 'twitchChannel002', 'channel002']
    )
    await db.run(
      'INSERT INTO twitchChannels (guildId, id, notificationChannelId) VALUES (?,?,?)', 
      ['guild002', 'twitchChannel001', 'channel003']
    )
    await db.run(
      'INSERT INTO twitchChannels (guildId, id, notificationChannelId) VALUES (?,?,?)', 
      ['guild002', 'twitchChannel003', 'channel004']
    )
  }

  const defaultDatabaseEntries = [
    {id: 'twitchChannel001', guildId: 'guild001', notificationChannelId: 'channel001', notificationRoleId: null},
    {id: 'twitchChannel002', guildId: 'guild001', notificationChannelId: 'channel002', notificationRoleId: null},
    {id: 'twitchChannel001', guildId: 'guild002', notificationChannelId: 'channel003', notificationRoleId: null},
    {id: 'twitchChannel003', guildId: 'guild002', notificationChannelId: 'channel004', notificationRoleId: null},
  ]

  beforeAll(async function() {
    db = await database

    await db.migrate()
  })

  beforeEach(async function() {
    await resetTwitchChannelsInDatabase()
    
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

    it('Should respond with an array of entries for the guild', async function() {
      fetchTwitchUsersMock.mockImplementation(async ({ ids }) => ids.map(id => ({
        id,
        display_name: `${id}_display_name`,
        description:  `${id}_description`,
        login:        `${id}_login`,
      })))

      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).not.toHaveBeenCalled()
      expect(fetchTwitchUsersMock).toHaveBeenCalledWith({ids: ['twitchChannel001', 'twitchChannel002']})
      expect(res.send).toHaveBeenCalledWith([
        {
          id:                    'twitchChannel001',
          name:                  'twitchChannel001_display_name',
          description:           'twitchChannel001_description',
          url:                   'https://www.twitch.tv/twitchChannel001_login',
          notificationChannelId: 'channel001',
          notificationRoleId:    null,
        },
        {
          id:                    'twitchChannel002',
          name:                  'twitchChannel002_display_name',
          description:           'twitchChannel002_description',
          url:                   'https://www.twitch.tv/twitchChannel002_login',
          notificationChannelId: 'channel002',
          notificationRoleId:    null,
        }
      ])
    })

    it('Should handle there being no twitch API results corrosponding with the entries', async function() {
      fetchTwitchUsersMock.mockResolvedValue([])

      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).not.toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith([
        {
          id:                    'twitchChannel001',
          name:                  '',
          description:           '',
          url:                   'https://www.twitch.tv/',
          notificationChannelId: 'channel001',
          notificationRoleId:    null,
        },
        {
          id:                    'twitchChannel002',
          name:                  '',
          description:           '',
          url:                   'https://www.twitch.tv/',
          notificationChannelId: 'channel002',
          notificationRoleId:    null,
        }
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
        id: 'twitchChannel999',
        notificationChannelId: 'channel999',
        notificationRoleId: 'role999',
      }
    }

    it('Should add an entry to the database', async function() {
      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(201)
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual([
        ...defaultDatabaseEntries,
        {id: 'twitchChannel999', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
      ])
    })
    
    it('Should respond with a 500 status code if there was an issue adding the entry to the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error')
      
      await cb(req, res)
      
      expect(console.error).toHaveBeenCalledWith('POST', path, 'Database error')
      expect(res.sendStatus).toHaveBeenCalledWith(500)
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })
    
    it('Should respond with a 409 status code if entry already exists', async function() {
      await cb(req, res)
      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(409)
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual([
        ...defaultDatabaseEntries,
        {id: 'twitchChannel999', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
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
        id:                    'twitchChannel001',
        notificationChannelId: 'channel999',
        notificationRoleId:    'role999'
      }
    }

    it('Should update an entry in the database', async function() {
      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual([
        {id: 'twitchChannel001', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
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
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })

    it('should ignore unsupported properties', async function() {
      req.body.foo = 'bar'

      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual([
        {id: 'twitchChannel001', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ])

      delete req.body.foo
    })

    it('Should respond with a 404 status code if the entry does not exist in the database', async function() {
      req.body.id = 'twitterUser999'

      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(404)
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual(defaultDatabaseEntries)
    })
  })
  
  describe('DELETE', function() {
    const cb = callbacks.delete[path]

    const req = {
      method: 'DELETE',
      originalUrl: path,
      params: {guild: 'guild001'},
      body: {
        id: 'twitchChannel001',
      }
    }
    
    it('Should delete an entry from the database', async function() {
      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual([
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
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })

    it('Should respond with a 404 status code if the entry does not exist in the database', async function() {
      await cb(req, res)
      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(404)
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual([
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ])
    })
  })
})