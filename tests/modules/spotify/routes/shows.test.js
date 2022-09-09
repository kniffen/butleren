import supertest from 'supertest'
import express from 'express'
import bodyParser from 'body-parser'

import spotifyRouter from '../../../../modules/spotify/routes/index.js'
import database from '../../../../database/index.js'
import fetchSpotifyShowsMock from '../../../../modules/spotify/utils/fetchSpotifyShows.js'
import fetchSpotifyShowEpisodesMock from '../../../../modules/spotify/utils/fetchSpotifyShowEpisodes.js'

jest.mock(
  '../../../../modules/spotify/utils/fetchSpotifyShows.js',
  () => ({__esModule: true, default: jest.fn()})
)

jest.mock(
  '../../../../modules/spotify/utils/fetchSpotifyShowEpisodes.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('/api/spotify/:guild/shows', function() {
  const URI = '/api/spotify/guild001/shows'
  let app = null
  let db  = null

  beforeAll(async function() {
    app = express()
    db = await database

    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
    app.use('/api/spotify', spotifyRouter)

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

    fetchSpotifyShowEpisodesMock.mockImplementation(id => ([
      {id: `${id}_episode001`},
      {id: `${id}_episode002`},
      {id: `${id}_episode003`},
    ]))
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  describe('GET', function() {
    it('Should respond with an array of shows for the guild', async function() {
      const res = await supertest(app).get(URI)

      expect(res.body).toEqual([
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

      const res = await supertest(app).get(URI)

      expect(res.body).toEqual([])
    })

    it('Should respond with a 500 status code if there was an issue reading from the database', async function() {
      jest.spyOn(db, 'all').mockRejectedValue('Database error')

      const res = await supertest(app).get(URI)

      expect(res.status).toEqual(500)
      expect(console.error).toHaveBeenCalledWith('GET', URI, 'Database error')

      db.all.mockRestore()
    })
  })
  
  describe('POST', function() {
    const body = {
      id: 'show999',
      notificationChannelId: 'channel001',
      notificationRoleId: 'role001'
    }

    it('Should respond with a 500 status code if there was an issue adding the show to the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error')
      
      const res = await supertest(app).post(URI).send(body)

      expect(res.status).toEqual(500)
      expect(console.error).toHaveBeenCalledWith('POST', URI, 'Database error')

      db.run.mockRestore()
    })

    it('Should add a show to the database', async function() {
      const res = await supertest(app).post(URI).send(body)

      expect(res.status).toEqual(201)
      expect(await db.all('SELECT * FROM spotifyShows')).toEqual([
        {guildId: 'guild001', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: null},
        {guildId: 'guild001', id: 'show002', latestEpisodeId: null, notificationChannelId: 'channel002', notificationRoleId: null},
        {guildId: 'guild002', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel003', notificationRoleId: null},
        {guildId: 'guild002', id: 'show003', latestEpisodeId: null, notificationChannelId: 'channel004', notificationRoleId: null},
        {guildId: 'guild001', id: 'show999', latestEpisodeId: 'show999_episode001', notificationChannelId: 'channel001', notificationRoleId: 'role001'},
      ])
    })

    it('Should handle the show having no episodes', async function() {
      fetchSpotifyShowEpisodesMock.mockResolvedValue([])

      await db.run('DELETE FROM spotifyShows WHERE id = ? AND guildId = ?', ['show999', 'guild001'])
      
      const res = await supertest(app).post(URI).send(body)
      
      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(201)
      expect(await db.all('SELECT * FROM spotifyShows')).toEqual([
        {guildId: 'guild001', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: null},
        {guildId: 'guild001', id: 'show002', latestEpisodeId: null, notificationChannelId: 'channel002', notificationRoleId: null},
        {guildId: 'guild002', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel003', notificationRoleId: null},
        {guildId: 'guild002', id: 'show003', latestEpisodeId: null, notificationChannelId: 'channel004', notificationRoleId: null},
        {guildId: 'guild001', id: 'show999', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: 'role001'},
      ])
    })

    it('Should respond with a 409 status code if entry already exists', async function() {
      const res = await supertest(app).post(URI).send(body)

      expect(res.status).toEqual(409)
    })

    it('Should respond with a 400 status code if there were missing body properties', async function() {
      const res = await supertest(app).post(URI).send({})

      expect(res.status).toEqual(400)
    })
  })
  
  describe('PATCH', function() {
    const expectedEntries = [
      {guildId: 'guild001', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel999', notificationRoleId: 'role999'},
      {guildId: 'guild001', id: 'show002', latestEpisodeId: null, notificationChannelId: 'channel002', notificationRoleId: null},
      {guildId: 'guild002', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel003', notificationRoleId: null},
      {guildId: 'guild002', id: 'show003', latestEpisodeId: null, notificationChannelId: 'channel004', notificationRoleId: null},
      {guildId: 'guild001', id: 'show999', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: 'role001'},
    ]

    const body = {
      id: 'show001',
      notificationChannelId: 'channel999',
      notificationRoleId: 'role999'
    }

    it('Should update a show entry in the database', async function() {
      const res = await supertest(app).patch(URI).send(body)
     
      expect(res.status).toEqual(200)
      expect(await db.all('SELECT * FROM spotifyShows')).toEqual(expectedEntries)
    })

    it('should ignore unsupported properties', async function() {
      const res = await supertest(app).patch(URI).send({
        ...body,
        foo: 'bar'
      })


      expect(console.error).not.toHaveBeenCalled()
      expect(res.status).toEqual(200)
      expect(await db.all('SELECT * FROM spotifyShows')).toEqual(expectedEntries)
    })

    it('Should respond with a 404 status code if the show does not exist in the database', async function() {
      const res = await supertest(app).patch(URI).send({
        ...body,
        id: 'show111'
      })

      expect(res.status).toEqual(404)
      expect(await db.all('SELECT * FROM spotifyShows')).toEqual(expectedEntries)
    })


    it('Should respond with a 500 status code if there was an issue updating the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error')

      const res = await supertest(app).patch(URI).send(body)

      expect(res.status).toEqual(500)
      expect(console.error).toHaveBeenCalledWith('PATCH', URI, 'Database error')
      expect(await db.all('SELECT * FROM spotifyShows')).toEqual(expectedEntries)

      db.run.mockRestore()
    })
  })
  
  describe('DELETE', function() {
    const expectedEntries = [
      {guildId: 'guild001', id: 'show002', latestEpisodeId: null, notificationChannelId: 'channel002', notificationRoleId: null},
      {guildId: 'guild002', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel003', notificationRoleId: null},
      {guildId: 'guild002', id: 'show003', latestEpisodeId: null, notificationChannelId: 'channel004', notificationRoleId: null},
      {guildId: 'guild001', id: 'show999', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: 'role001'},
    ]

    const body = {
      id: 'show001'
    }

    it('Should respond with a 500 status code if there was an issue updating the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error')
      
      const res = await supertest(app).delete(URI).send(body)

      expect(res.status).toEqual(500)
      expect(console.error).toHaveBeenCalledWith('DELETE', URI, 'Database error')

      db.run.mockRestore()
    })

    it('Should delete a show entry in the database', async function() {
      const res = await supertest(app).delete(URI).send(body)

      expect(res.status).toEqual(200)
      expect(await db.all('SELECT * FROM spotifyShows')).toEqual(expectedEntries)
    })

    it('Should respond with a 404 status code if the show does not exist in the database', async function() {
      const res = await supertest(app).delete(URI).send(body)

      expect(res.status).toEqual(404)
      expect(await db.all('SELECT * FROM spotifyShows')).toEqual(expectedEntries)
    })
  })
})