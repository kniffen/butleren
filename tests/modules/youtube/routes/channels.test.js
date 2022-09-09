import express from 'express'
import bodyParser from 'body-parser'
import supertest from 'supertest'

import database from '../../../../database/index.js'
import fetchYouTubeChannelsMock from '../../../../modules/youtube/utils/fetchYouTubeChannels.js'
import youtubeRouter from '../../../../modules/youtube/routes/index.js'

jest.mock(
  '../../../../modules/youtube/utils/fetchYouTubeChannels.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('/api/youtube/:guild/channels', function() {
  let app = null
  let db = null
  const URI = '/api/youtube/guild001/channels'

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
    app = express()

    app.use(bodyParser.json())
    app.use('/api/youtube', youtubeRouter)

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
    it('Should respond with an array of channels for the guild', async function() {
      const res = await supertest(app).get(URI)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.body).toEqual([
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

      const res = await supertest(app).get(URI)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.body).toEqual([
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

      const res = await supertest(app).get(URI)

      expect(console.error).toHaveBeenCalledWith('GET', URI, 'Database error')
      expect(res.status).toEqual(500)

      db.all.mockRestore()
    })
  })

  describe('POST', function() {
    const body = {
      id: 'youtubeChannel999',
      notificationChannelId: 'channel999',
      notificationRoleId: 'role999',
    }

    it('Should add an entry to the database', async function() {
      const res = await supertest(app).post(URI).send(body)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(201)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual([
        ...defaultDatabaseEntries,
        {id: 'youtubeChannel999', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
      ])
    })
    
    it('Should respond with a 500 status code if there was an issue adding the entry to the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error')
      
      const res = await supertest(app).post(URI).send(body)
      
      expect(console.error).toHaveBeenCalledWith('POST', URI, 'Database error')
      expect(res.status).toEqual(500)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })
    
    it('Should respond with a 409 status code if entry already exists', async function() {
      await supertest(app).post(URI).send(body)
      const res = await supertest(app).post(URI).send(body)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(409)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual([
        ...defaultDatabaseEntries,
        {id: 'youtubeChannel999', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
      ])
    })
    
    it('Should respond with a 400 status code if there were missing body properties', async function() {
      const res = await supertest(app).post(URI).send({})

      expect(res.status).toEqual(400)
    })
  })

  describe('PATCH', function() {
    const body = {
      id: 'youtubeChannel001',
      notificationChannelId: 'channel999',
      notificationRoleId: 'role999'
    }

    it('Should update an entry in the database', async function() {
      const res = await supertest(app).patch(URI).send(body)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(200)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual([
        {id: 'youtubeChannel001', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
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
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })

    it('should ignore unsupported properties', async function() {
      const res = await supertest(app).patch(URI).send({
        ...body,
        foo: 'bar'
      })

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(200)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual([
        {id: 'youtubeChannel001', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ])
    })

    it('Should respond with a 404 status code if the entry does not exist in the database', async function() {
      const res = await supertest(app).patch(URI).send({
        ...body,
        id: 'youtubeChannel999'
      })

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(404)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual(defaultDatabaseEntries)
    })
  })

  describe('DELETE', function() {
    const body = {
      id: 'youtubeChannel001'
    }

    it('Should delete an entry from the database', async function() {
      const res = await supertest(app).delete(URI).send(body)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(200)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual([
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
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual(defaultDatabaseEntries)

      db.run.mockRestore()
    })

    it('Should respond with a 404 status code if the entry does not exist in the database', async function() {
      await supertest(app).delete(URI).send(body)
      const res = await supertest(app).delete(URI).send(body)

      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(404)
      expect(await db.all('SELECT * FROM youtubeChannels')).toEqual([
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ])
    })
  })

})