import express from 'express'
import supertest from 'supertest'

import database from '../../../database/index.js'
import discordClientMock from '../../../discord/client.js'
import guildsRouter from '../../../routes/guilds/index.js'

jest.mock('../../../discord/client.js', () => ({
  __esModule: true,
  default: {
    guilds: {fetch: jest.fn()}
  }
}))

describe('/api/guilds', function() {
  const URI = '/api/guilds'
  const guilds = new Map()
  const app = express()
  let db = null
  
  beforeAll(async function() {
    db = await database

    app.use(URI, guildsRouter)

    await db.migrate()
    await db.run('INSERT INTO guilds (id) VALUES (?)', 'guild001')
    await db.run('INSERT INTO guilds (id) VALUES (?)', 'guild002')

    guilds.set('guild001', {
      id: 'guild001',
      name: 'guildname001',
      iconURL: () => 'foo.bar',
    })

    discordClientMock.guilds.fetch.mockImplementation(async (id) => {
      const guild = guilds.get(id)
      if (guild) return Promise.resolve(guild)
      return Promise.reject('Guild not found')
    })
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    db.close()
  })

  describe('GET', function() {
    it('should respond with the details and settings for all guilds', async function() {
      const expected = [
        {
          id: 'guild001',
          name: 'guildname001',
          color: '#19D8B4',
          nickname: null,
          timezone: 'UTC',
          iconURL: 'foo.bar',
        },
        {
          id: 'guild002',
          color: '#19D8B4',
          nickname: null,
          timezone: 'UTC',
        }
      ]

      const res = await supertest(app).get(URI)

      expect(res.status).toEqual(200)
      expect(res.body).toEqual(expected)
      expect(console.error).toHaveBeenCalledWith('GET', URI, 'Guild not found')
    })
  })
})