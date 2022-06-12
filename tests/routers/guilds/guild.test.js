import database from '../../../database/index.js'
import { callbacks } from '../../../routes/router.js'
import discordClientMock from '../../../discord/client.js'

import '../../../routes/guilds/guild.js'

jest.mock('../../../discord/client.js', () => ({
  __esModule: true,
  default: {
    user: {id: 'user001'},
    guilds: {fetch: jest.fn()}
  }
}))

const path = '/api/guilds/:guild'

describe(path, function() {
  let db = null

  const res = {
    send:       jest.fn(),
    sendStatus: jest.fn(),
  }

  const guilds   = new Map()
  const channels = new Map()
  const roles    = new Map()
  const members  = new Map()
  
  beforeAll(async function() {
    db = await database

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

    channels.set('channel001', {id: 'channel001', name: 'channelname001', type: 'GUILD_TEXT'})
    channels.set('channel002', {id: 'channel002', name: 'channelname002', type: 'GUILD_CATEGORY'})

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
    const cb = callbacks.get[path]

    const req = {
      method: 'GET',
      originalUrl: path,
      params: {guild: 'guild001'}
    }
    
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

      await cb(req, res)

      expect(res.sendStatus).not.toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith(expected)
    })

    it('should respond with a 404 if the guild does not exist', async function() {
      req.params.guild = 'guild999'
      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(404)
      expect(res.send).not.toHaveBeenCalled()
    })
  })
  
  describe('PUT', function() {
    let req = null
    const cb = callbacks.put[path]

    beforeEach(function() {
      req = {
        method: 'PUT',
        originalUrl: path,
        params: {
          guild: 'guild001'
        },
        body: {
          nickname: '',
          color: '#0FFFFF',
          timezone: 'Europe/Berlin',
        }
      }
    })
    
    it('should update the guild\'s entry in the database', async function() {
      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(200)

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
      req.body.nickname = 'foo'
      
      await cb(req, res)

      expect(members.get('user001').setNickname).toHaveBeenCalledWith('foo')
      expect(res.sendStatus).toHaveBeenCalledWith(200)

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
      guilds.get(req.params.guild).members.fetch.mockRejectedValue('Member not found')
      req.body.nickname = 'bar'

      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(404)
      expect(console.error).toHaveBeenCalledWith('PUT', path, 'Member not found')

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

    it('should respond with a 404 if the guild does not exist', async function() {
      req.params.guild = 'guild999'

      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(404)
      expect(console.error).toHaveBeenCalledWith('PUT', path, 'Guild not found')

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
  })
})