import database from '../../../database/index.js'
import { callbacks } from '../../../routes/router.js'
import discordClientMock from '../../../discord/client.js'

import '../../../routes/guilds/index.js'

jest.mock('../../../discord/client.js', () => ({
  __esModule: true,
  default: {
    guilds: {fetch: jest.fn()}
  }
}))

const path = '/api/guilds'

describe(path, function() {
  let db = null

  const res = {
    send: jest.fn()
  }

  const guilds = new Map()
  
  beforeAll(async function() {
    db = await database

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

  afterAll(function() {
    db.close()
  })

  describe('GET', function() {
    const cb = callbacks.get[path]

    const req = {
      method: 'GET',
      originalUrl: path
    }

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

      await cb(req, res)

      expect(res.send).toHaveBeenCalledWith(expected)
      expect(console.error).toHaveBeenCalledWith('GET', path, 'Guild not found')
    })
  })
})