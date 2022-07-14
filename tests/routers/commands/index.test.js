import { Collection } from 'discord.js'

import { callbacks } from '../../../routes/router.js'
import clientMock from '../../../discord/client.js'

import '../../../routes/commands/index.js'

jest.mock('../../../discord/client.js', () => ({
  __esModule: true,
  default: {
    guilds: {
      fetch: jest.fn()
    }
  }
}))

jest.mock('../../../modules/index.js', () => ({
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

const path = '/api/commands/:guild'

describe(path, function() {
  const res = {
    send:       jest.fn(),
    sendStatus: jest.fn(),
  }

  const guild = {
    commands: {
      fetch: jest.fn()
    }
  }

  const guildCommands = new Collection()
  guildCommands.set('cmd001', {name: 'command001'})
  guildCommands.set('cmd003', {name: 'command003'})

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
    const cb = callbacks.get[path]

    const req = {
      method: 'GET',
      originalUrl: path,
      params: {
        guild: 'guild001'
      }
    }

    it('should respond with an array of commands', async function() {
      await cb(req, res)

      expect(res.send).toHaveBeenCalledWith([
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

      await cb(req, res)

      expect(console.error).toHaveBeenCalledWith('GET', path, 'Error message')
      expect(res.send).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(404)
    })

    it('should resport with a 404 status code if the guild does not exist', async function() {
      clientMock.guilds.fetch.mockRejectedValue('Error message')

      await cb(req, res)

      expect(console.error).toHaveBeenCalledWith('GET', path, 'Error message')
      expect(res.send).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(404)
    })

    it('should resport with a 500 status code if something went wrong fetching the commands', async function() {
      const err = new Error('Error message')
      res.send.mockImplementation(() => { throw err})
      
      await cb(req, res)

      expect(console.error).toHaveBeenCalledWith('GET', path, err)
      expect(res.sendStatus).toHaveBeenCalledWith(500)
    })
  })
})