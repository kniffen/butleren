import express from 'express'
import supertest from 'supertest'
import { Collection } from 'discord.js'

import clientMock from '../../discord/client.js'

import commandsRouter from './index.js'

jest.mock('../../discord/client.js', () => ({
  __esModule: true,
  default: {
    guilds: {
      fetch: jest.fn()
    }
  }
}))

jest.mock('../../modules/index.js', () => ({
  __esModule: true,
  mod001: {
    name: 'module001',
    commands: {
      cmd001: {
        data: {name: 'command001', description: 'description001'},
        isLocked: false
      },
      cmd002: {
        data: {name: 'command002', description: 'description002'},
        isLocked: false
      }
    }
  },
  mod002: {
    name: 'module002',
    commands: {
      cmd003: {
        data: {name: 'command003', description: 'description003'},
        isLocked: true
      }
    }
  },
  mod003: {
    name: 'module003'
  }
}))

describe('/api/commands/:guild', function() {
  let app = null
  const URI = '/api/commands/guild001'
  
  const guild = {
    commands: {
      fetch: jest.fn()
    }
  }

  const guildCommands = new Collection()
  guildCommands.set('cmd001', {name: 'command001'})
  guildCommands.set('cmd003', {name: 'command003'})

  beforeAll(function() {
    app = express()

    app.use('/api/commands', commandsRouter)
  })

  beforeEach(function() {
    clientMock.guilds.fetch.mockResolvedValue(guild)
    guild.commands.fetch.mockResolvedValue(guildCommands)
  })

  afterEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  describe('GET', function() {
    it('should respond with an array of commands', async function() {
      const res = await supertest(app).get(URI)

      expect(res.body).toEqual([
        {
          id:   'cmd001',
          name: 'command001',
          description: 'description001',
          isEnabled: true,
          isLocked: false,
          module: {id: 'mod001', name: 'module001'}
        },
        {
          id:   'cmd002',
          name: 'command002',
          description: 'description002',
          isEnabled: false,
          isLocked: false,
          module: {id: 'mod001', name: 'module001'}
        },
        {
          id:   'cmd003',
          name: 'command003',
          description: 'description003',
          isEnabled: true,
          isLocked: true,
          module: {id: 'mod002', name: 'module002'}
        }
      ])
    })

    it('should respond with a 404 status code if there was an issue fetching commands from the guild', async function() {
      guild.commands.fetch.mockRejectedValue('Error message')

      const res = await supertest(app).get(URI)

      expect(console.error).toHaveBeenCalledWith('GET', URI, 'Error message')
      expect(res.status).toEqual(404)
    })

    it('should resport with a 404 status code if the guild does not exist', async function() {
      clientMock.guilds.fetch.mockRejectedValue('Error message')
      
      const res = await supertest(app).get(URI)

      expect(console.error).toHaveBeenCalledWith('GET', URI, 'Error message')
      expect(res.status).toEqual(404)
    })

    it('should resport with a 500 status code if something went wrong fetching the commands', async function() {
      clientMock.guilds.fetch.mockResolvedValue('foobar')
      
      const res = await supertest(app).get(URI)

      expect(console.error).toHaveBeenCalledWith('GET', URI, expect.anything())
      expect(res.status).toEqual(500)
    })
  })
})