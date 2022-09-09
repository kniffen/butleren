import express from 'express'
import bodyParser from 'body-parser'
import supertest from 'supertest'

import database from '../../../../database/index.js'
import fetchtwitterUsersMock from '../../../../modules/twitter/utils/fetchtwitterUsers.js'

import twitterRouter from '../../../../modules/twitter/routes/index.js'

jest.mock(
  '../../../../modules/twitter/utils/fetchtwitterUsers.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('/api/twitter/:guild/users', function() {
  let app = null
  let db = null
  const URI = '/api/twitter/guild001/users'

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
    app = express()

    app.use(bodyParser.json())
    app.use('/api/twitter', twitterRouter)

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
    it('Should respond with an array of twitter users for the guild', async function() {
      const res = await supertest(app).get(URI)

      expect(fetchtwitterUsersMock).toHaveBeenCalledWith({ids: ['twitterUser001', 'twitterUser002']})
      expect(res.body).toEqual([
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

      const res = await supertest(app).get(URI)

      expect(res.body).toEqual([
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

      const res = await supertest(app).get(URI)

      expect(console.error).toHaveBeenCalledWith('GET', URI, 'Database error')
      expect(res.status).toEqual(500)

      db.all.mockRestore()
    })
  })

  describe('POST', function() {
    const body = {
      id: 'twitterUser999',
      notificationChannelId: 'channel999',
      notificationRoleId: 'role999',
    }

    it('Should add a show to the database', async function() {
      const res = await supertest(app).post(URI).send(body)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(201)
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual([
        ...defaultDatabaseEntries,
        {id: 'twitterUser999', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
      ])
    })
    
    it('Should respond with a 500 status code if there was an issue adding the twitter user to the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error')
      
      const res = await supertest(app).post(URI).send(body)

      expect(console.error).toHaveBeenCalledWith('POST', URI, 'Database error')
      expect(res.status).toEqual(500)
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })
    
    it('Should respond with a 409 status code if entry already exists', async function() {
      await supertest(app).post(URI).send(body)
      const res = await supertest(app).post(URI).send(body)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(409)
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual([
        ...defaultDatabaseEntries,
        {id: 'twitterUser999', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
      ])
    })

    it('Should respond with a 400 status code if there were missing body properties', async function() {
      const res = await supertest(app).post(URI).send({})

      expect(res.status).toEqual(400)
    })
  })
  
  describe('PATCH', function() {
    const body = {
      id: 'twitterUser001',
      notificationChannelId: 'channel999',
      notificationRoleId: 'role999'
    }

    it('Should update an entry in the database', async function() {
      const res = await supertest(app).patch(URI).send(body)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(200)
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual([
        {id: 'twitterUser001', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ])
    })

    it('Should respond with a 500 status code if there was an issue updating the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error')
      
      const res = await supertest(app).patch(URI).send(body)
      
      expect(console.error).toHaveBeenCalledWith('PATCH', URI, 'Database error')
      expect(res.status).toEqual(500)
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })

    it('should ignore unsupported properties', async function() {
      const res = await supertest(app).patch(URI).send({
        ...body,
        foo: 'bar'
      })

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(200)
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual([
        {id: 'twitterUser001', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ])
    })

    it('Should respond with a 404 status code if the entry does not exist in the database', async function() {
      const res = await supertest(app).patch(URI).send({
        ...body,
        id: 'twitterUser999'
      })

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(404)
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual(defaultDatabaseEntries)
    })
  })
  
  describe('DELETE', function() {
    const body = {
      id: 'twitterUser001',
    }
    
    it('Should delete an entry from the database', async function() {
      const res = await supertest(app).delete(URI).send(body)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(200)
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual([
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ])
    })
    
    it('Should respond with a 500 status code if there was an issue updating the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error')
      
      const res = await supertest(app).delete(URI).send(body)
      
      expect(console.error).toHaveBeenCalledWith('DELETE', URI, 'Database error')
      expect(res.status).toEqual(500)
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })

    it('Should respond with a 404 status code if the entry does not exist in the database', async function() {
      await supertest(app).delete(URI).send(body)
      const res = await supertest(app).delete(URI).send(body)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(404)
      expect(await db.all('SELECT * FROM twitterUsers')).toEqual([
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ])
    })
  })
})