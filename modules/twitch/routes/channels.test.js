import express from 'express'
import bodyParser from 'body-parser'
import supertest from 'supertest'

import database from '../../../database/index.js'
import twitchRouter from './index.js'
import fetchTwitchUsersMock from '../utils/fetchTwitchUsers.js'

jest.mock(
  '../utils/fetchTwitchUsers.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('/api/twitch/:guild/channels', function() {
  const URI = '/twitch/guild001/channels'
  let app = null
  let db  = null

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
    app = express()
    db = await database

    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
    app.use('/twitch', twitchRouter)

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
    it('Should respond with an array of entries for the guild', async function() {
      fetchTwitchUsersMock.mockImplementation(async ({ ids }) => ids.map(id => ({
        id,
        display_name: `${id}_display_name`,
        description:  `${id}_description`,
        login:        `${id}_login`,
      })))

      const res = await supertest(app).get(URI)

      expect(console.error).not.toHaveBeenCalled()
      expect(fetchTwitchUsersMock).toHaveBeenCalledWith({ids: ['twitchChannel001', 'twitchChannel002']})
      expect(res.body).toEqual([
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

      const res = await supertest(app).get(URI)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(200)
      expect(res.body).toEqual([
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

      const res = await supertest(app).get(URI)

      expect(console.error).toHaveBeenCalledWith('GET', '/twitch/guild001/channels', 'Database error')
      expect(res.status).toEqual(500)

      db.all.mockRestore()
    })
  })
  
  describe('POST', function() {
    const body = {
      id: 'twitchChannel999',
      notificationChannelId: 'channel999',
      notificationRoleId: 'role999',
    }

    it('Should add an entry to the database', async function() {
      const res = await supertest(app).post(URI).send(body)
     
      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(201)
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual([
        ...defaultDatabaseEntries,
        {id: 'twitchChannel999', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
      ])
    })
    
    it('Should respond with a 500 status code if there was an issue adding the entry to the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error')
      
      const res = await supertest(app).post(URI).send(body)
      
      expect(console.error).toHaveBeenCalledWith('POST', URI, 'Database error')
      expect(res.status).toEqual(500)
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })
    
    it('Should respond with a 409 status code if entry already exists', async function() {
      await supertest(app).post(URI).send(body)
      const res = await supertest(app).post(URI).send(body)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(409)
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual([
        ...defaultDatabaseEntries,
        {id: 'twitchChannel999', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
      ])
    })

    it('Should respond with a 400 status code if there were missing body properties', async function() {
      const res = await supertest(app).post(URI).send({})

      expect(res.status).toEqual(400)
    })
  })
  
  describe('PATCH', function() {
    const body = {
      id: 'twitchChannel001',
      notificationChannelId: 'channel999',
      notificationRoleId: 'role999'
    }

    it('Should update an entry in the database', async function() {
      const res = await supertest(app).patch(URI).send(body)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(200)
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual([
        {id: 'twitchChannel001', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
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
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })

    it('should ignore unsupported properties', async function() {
      const res = await supertest(app).patch(URI).send({
        ...body,
        foo: 'bar'
      })

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(200)
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual([
        {id: 'twitchChannel001', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ])
    })

    it('Should respond with a 404 status code if the entry does not exist in the database', async function() {
      const res = await supertest(app).patch(URI).send({
        ...body,
        id: 'twitchUser999'
      })

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(404)
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual(defaultDatabaseEntries)
    })
  })
  
  describe('DELETE', function() {
    const body = {
      id: 'twitchChannel001'
    }
    
    it('Should delete an entry from the database', async function() {
      const res = await supertest(app).delete(URI).send(body)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(200)
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual([
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
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })

    it('Should respond with a 404 status code if the entry does not exist in the database', async function() {
      await supertest(app).delete(URI).send(body)
      const res = await supertest(app).delete(URI).send(body)
      
      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(404)
      expect(await db.all('SELECT * FROM twitchChannels')).toEqual([
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ])
    })
  })
})