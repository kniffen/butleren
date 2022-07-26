import database from '../../../../database/index.js'
import { callbacks } from '../../../../routes/router.js'
import fetchtwitterUsersMock from '../../../../modules/twitter/utils/fetchtwitterUsers.js'

import '../../../../modules/twitter/routes/users.js'

jest.mock(
  '../../../../modules/twitter/utils/fetchtwitterUsers.js',
  () => ({__esModule: true, default: jest.fn()})
)

const path = '/api/twitter/:guild/users'

describe(path, function() {
  let db = null

  const res = {
    send: jest.fn(),
    sendStatus: jest.fn()
  }

  async function resetDatabase() {
    await db.run('DELETE FROM twitterUsers')

    await db.run(
      'INSERT INTO twitterUsers (guildId, id, notificationChannelId) VALUES (?,?,?)',
      ['guild001', 'twitterUser001', 'channel001']
    )
    await db.run(
      'INSERT INTO twitterUsers (guildId, id, notificationChannelId) VALUES (?,?,?)', 
      ['guild001', 'twitterUser002', 'channel002']
    )
    await db.run(
      'INSERT INTO twitterUsers (guildId, id, notificationChannelId) VALUES (?,?,?)', 
      ['guild002', 'twitterUser001', 'channel003']
    )
    await db.run(
      'INSERT INTO twitterUsers (guildId, id, notificationChannelId) VALUES (?,?,?)', 
      ['guild002', 'twitterUser003', 'channel004']
    )
  }

  const defaultDatabaseEntries = [
    {id: 'twitterUser001', guildId: 'guild001', notificationChannelId: 'channel001', notificationRoleId: null},
    {id: 'twitterUser002', guildId: 'guild001', notificationChannelId: 'channel002', notificationRoleId: null},
    {id: 'twitterUser001', guildId: 'guild002', notificationChannelId: 'channel003', notificationRoleId: null},
    {id: 'twitterUser003', guildId: 'guild002', notificationChannelId: 'channel004', notificationRoleId: null},
  ]

  beforeAll(async function() {
    db = await database

    await db.migrate()
    
    fetchtwitterUsersMock.mockResolvedValue([
      {id: 'twitterUser001', foo: 'bar'},
      {id: 'twitterUser002', bar: 'baz'},
      {id: 'twitterUser003'},
    ])
  })
  
  beforeEach(async function() {
    await resetDatabase()
    
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

    it('Should respond with an array of twitter users for the guild', async function() {
      await cb(req, res)

      expect(fetchtwitterUsersMock).toHaveBeenCalledWith({ids: ['twitterUser001', 'twitterUser002']})
      expect(res.send).toHaveBeenCalledWith([
        {
          id: 'twitterUser001',
          notificationChannelId: 'channel001',
          notificationRoleId: null,
          foo: 'bar'
        },
        {
          id: 'twitterUser002',
          notificationChannelId: 'channel002',
          notificationRoleId: null,
          bar: 'baz'
        }
      ])
    })
    
    it('Should handle there being no twitter users for the IDs', async function() {
      fetchtwitterUsersMock.mockResolvedValue([])

      await cb(req, res)

      expect(res.send).toHaveBeenCalledWith([
        {
          id: 'twitterUser001',
          notificationChannelId: 'channel001',
          notificationRoleId: null,
        },
        {
          id: 'twitterUser002',
          notificationChannelId: 'channel002',
          notificationRoleId: null,
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
        id: 'twitterUser999',
        notificationChannelId: 'channel999',
        notificationRoleId: 'role999',
      }
    }

    it('Should add a show to the database', async function() {
      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(201)
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual([
        ...defaultDatabaseEntries,
        {id: 'twitterUser999', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
      ])
    })
    
    it('Should respond with a 500 status code if there was an issue adding the twitter user to the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error')
      
      await cb(req, res)
      
      expect(console.error).toHaveBeenCalledWith('POST', path, 'Database error')
      expect(res.sendStatus).toHaveBeenCalledWith(500)
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })
    
    it('Should respond with a 409 status code if entry already exists', async function() {
      await cb(req, res)
      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(409)
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual([
        ...defaultDatabaseEntries,
        {id: 'twitterUser999', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
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
        id:                    'twitterUser001',
        notificationChannelId: 'channel999',
        notificationRoleId:    'role999'
      }
    }

    it('Should update an entry in the database', async function() {
      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual([
        {id: 'twitterUser001', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
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
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })

    it('should ignore unsupported properties', async function() {
      req.body.foo = 'bar'

      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual([
        {id: 'twitterUser001', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
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
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual(defaultDatabaseEntries)
    })
  })
  
  describe('DELETE', function() {
    const cb = callbacks.delete[path]

    const req = {
      method: 'DELETE',
      originalUrl: path,
      params: {guild: 'guild001'},
      body: {
        id: 'twitterUser001',
      }
    }
    
    it('Should delete an entry from the database', async function() {
      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual([
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
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })

    it('Should respond with a 404 status code if the entry does not exist in the database', async function() {
      await cb(req, res)
      await cb(req, res)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(404)
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual([
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ])
    })
  })
})