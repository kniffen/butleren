import { Collection } from 'discord.js'
import { callbacks } from '../../../routes/router.js'
import discordClientMock from '../../../discord/client.js'

import '../../../routes/guilds/channels.js'

jest.mock('../../../discord/client.js', () => ({
  __esModule: true,
  default: {
    guilds: {fetch: jest.fn()}
  }
}))

const path = '/api/guilds/:guild/channels'

describe(path, function() {
  const res = {
    send: jest.fn(),
    sendStatus: jest.fn(),
  }

  const channels = new Collection()

  const guild = {
    id: 'guild001',
    channels: {
      fetch: jest.fn(async () => channels)
    },
  }

  beforeAll(function() {    
    channels.set('channel001', {id: 'channel001', name: 'channelname001', type: 'GUILD_TEXT'})
    channels.set('channel002', {id: 'channel002', name: 'channelname002', type: 'GUILD_CATEGORY'})
    channels.set('channel003', {id: 'channel003', name: 'channelname003', type: 'GUILD_NEWS'})

    discordClientMock.guilds.fetch.mockRejectedValue('Guild not found')
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  describe('GET', function() {
    const cb = callbacks.get[path]

    const req = {
      method: 'GET',
      originalUrl: path,
      params: {
        guild: 'guild999'
      }
    }

    it('should respond with a 404 status code if the guild could not be found', async function() {
      await cb(req, res)

      expect(res.send).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(404)
      expect(console.error).toHaveBeenCalledWith('GET', path, 'Guild not found')
    })

    it('should respond with a list of available text channels', async function() {
      discordClientMock.guilds.fetch.mockResolvedValue(guild)
      await cb(req, res)

      expect(res.sendStatus).not.toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith([
        {id: 'channel001', name: 'channelname001'},
        {id: 'channel003', name: 'channelname003'},
      ])
    })
  })
})