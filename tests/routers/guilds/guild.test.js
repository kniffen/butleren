import express from 'express'
import bodyParser from 'body-parser'
import supertest from 'supertest'
import { ChannelType } from 'discord.js'

import database from '../../../database/index.js'
import discordClientMock from '../../../discord/client.js'
import guildsRouter from '../../../routes/guilds/index.js'

jest.mock('../../../discord/client.js', () => ({
  __esModule: true,
  default: {
    user: {id: 'user001'},
    guilds: {fetch: jest.fn()}
  }
}))

describe('/api/guilds/:guild', function() {
  const URI = '/api/guilds/guild001'
  const app = express()
  let db = null

  const guilds   = new Map()
  const channels = new Map()
  const roles    = new Map()
  const members  = new Map()
  
  beforeAll(async function() {
    db = await database

    app.use(bodyParser.json())
    app.use('/api/guilds', guildsRouter)

    await db.migrate()
    await db.run('INSERT INTO guilds (id) VALUES (?)', ['guild001'])
    await db.run('INSERT INTO guilds (id) VALUES (?)', ['guild002'])

    guilds.set('guild001', {
      id: 'guild001',
      name: 'guildname001',
      iconURL: () => 'foo.bar',
      channels: {
        fetch: jest.fn(async () => channels)
      },
      roles: {
        fetch: jest.fn(async () => roles)
      },
      members: {
        fetch: jest.fn(async (id) => members.get(id))
      }
    })

    channels.set('channel001', {id: 'channel001', name: 'channelname001', type: ChannelType.GuildText})
    channels.set('channel002', {id: 'channel002', name: 'channelname002', type: ChannelType.GuildCategory})

    roles.set('role001', {id: 'role001', name: 'rolename001'})
    roles.set('role002', {id: 'role002', name: 'rolename002'})

    members.set('user001', {id: 'user001', setNickname: jest.fn()})

    discordClientMock.guilds.fetch.mockImplementation((id) => {
      const guild = guilds.get(id)
      if (guild) return Promise.resolve(guild)
      return Promise.reject('Guild not found')
    })
  })

  afterAll(function() {
    db.close()
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  describe('GET', function() {
    it('should respond with data for the guild', async function() {
      const expected = {
        id: 'guild001',
        name: 'guildname001',
        color: '#19D8B4',
        nickname: null,
        timezone: 'UTC',
        iconURL: 'foo.bar',
        categories: 1,
        textChannels: 1,
        voiceChannels: 0,
        roles: 2,
      }

      const res = await supertest(app).get(URI)

      expect(res.status).toEqual(200)
      expect(res.body).toEqual(expected)
    })

    it('should respond with a 404 if the guild does not exist', async function() {
      const res = await supertest(app).get('/api/guilds/guild999')

      expect(res.status).toEqual(404)
    })
  })
  
  describe('PUT', function() {
    const body = {
      nickname: '',
      color: '#0FFFFF',
      timezone: 'Europe/Berlin',
    }
    
    it('should update the guild\'s entry in the database', async function() {
      const res = await supertest(app).put(URI).send(body)

      expect(res.status).toEqual(200)
      expect(await db.all('SELECT * FROM guilds')).toEqual([
        {
          id: 'guild001',
          nickname: null,
          color: '#0FFFFF',
          timezone: 'Europe/Berlin',
        },
        {
          id: 'guild002',
          nickname: null,
          color: '#19D8B4',
          timezone: 'UTC',
        },
      ])
    })
    
    it('should update the bot\'s nickname', async function() {
      const res = await supertest(app).put(URI).send({
        ...body,
        nickname: 'foo'
      })

      expect(members.get('user001').setNickname).toHaveBeenCalledWith('foo')
      expect(res.status).toEqual(200)

      expect(await db.all('SELECT * FROM guilds')).toEqual([
        {
          id: 'guild001',
          nickname: 'foo',
          color: '#0FFFFF',
          timezone: 'Europe/Berlin',
        },
        {
          id: 'guild002',
          nickname: null,
          color: '#19D8B4',
          timezone: 'UTC',
        },
      ])
    })
    
    it('should respond with a 404 code if the Bot\'s member object could not be resolved', async function() {
      guilds.get('guild001').members.fetch.mockRejectedValue('Member not found')
      // req.body.nickname = 'bar'

      const res = await supertest(app).put(URI).send(body)

      expect(res.status).toEqual(404)
      expect(console.error).toHaveBeenCalledWith('PUT', URI, 'Member not found')

      expect(await db.all('SELECT * FROM guilds')).toEqual([
        {
          id: 'guild001',
          nickname: 'foo',
          color: '#0FFFFF',
          timezone: 'Europe/Berlin',
        },
        {
          id: 'guild002',
          nickname: null,
          color: '#19D8B4',
          timezone: 'UTC',
        },
      ])
    })

  //   it('should respond with a 404 if the guild does not exist', async function() {
  //     const res = await supertest(app).put('/api/guilds/guild999').send(body)

  //     expect(res.status).toEqual(404)
  //     expect(console.error).toHaveBeenCalledWith('PUT', '/api/guilds/guild999', 'Guild not found')

  //     expect(await db.all('SELECT * FROM guilds')).toEqual([
  //       {
  //         id: 'guild001',
  //         nickname: 'foo',
  //         color: '#0FFFFF',
  //         timezone: 'Europe/Berlin',
  //       },
  //       {
  //         id: 'guild002',
  //         nickname: null,
  //         color: '#19D8B4',
  //         timezone: 'UTC',
  //       },
  //     ])
  //   })
  })
})