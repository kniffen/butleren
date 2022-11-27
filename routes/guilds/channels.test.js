import express from 'express'
import supertest from 'supertest'
import { Collection, ChannelType } from 'discord.js'

import discordClientMock from '../../discord/client.js'
import guildsRouter from './index.js'

jest.mock('../../discord/client.js', () => ({
  __esModule: true,
  default: {
    guilds: {fetch: jest.fn()}
  }
}))

describe('/api/guilds/:guild/channels', function() {
  const URI = '/api/guilds/guild001/channels'
  const app = express()
  const channels = new Collection()

  const guild = {
    id: 'guild001',
    channels: {
      fetch: jest.fn(async () => channels)
    },
  }

  beforeAll(function() {
    app.use('/api/guilds', guildsRouter)
    
    channels.set('channel001', {id: 'channel001', name: 'channelname001', type: ChannelType.GuildText})
    channels.set('channel002', {id: 'channel002', name: 'channelname002', type: ChannelType.GuildCategory})
    channels.set('channel003', {id: 'channel003', name: 'channelname003', type: ChannelType.GuildAnnouncement})

    discordClientMock.guilds.fetch.mockRejectedValue('Guild not found')
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  describe('GET', function() {
    it('should respond with a 404 status code if the guild could not be found', async function() {
      const res = await supertest(app).get(URI)

      expect(res.status).toEqual(404)
      expect(console.error).toHaveBeenCalledWith('GET', URI, 'Guild not found')
    })

    it('should respond with a list of available text channels', async function() {
      discordClientMock.guilds.fetch.mockResolvedValue(guild)
      
      const res = await supertest(app).get(URI)

      expect(res.status).toEqual(200)
      expect(res.body).toEqual([
        {id: 'channel001', name: 'channelname001'},
        {id: 'channel003', name: 'channelname003'},
      ])
    })
  })
})