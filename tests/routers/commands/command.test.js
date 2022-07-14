import { Collection } from 'discord.js'

import database from '../../../database/index.js'
import { callbacks } from '../../../routes/router.js'
import clientMock from '../../../discord/client.js'

import '../../../routes/commands/command.js'

const path = '/api/commands/:guild/:module/:command'

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
    id: 'mod001',
    name: 'module001',
    commands: {
      cmd001: {
        data: {name: 'command001', description: 'description001', toJSON: () => ({name: 'command001'})},
        isLocked: false
      },
      cmd002: {
        data: {name: 'command002', description: 'description002', toJSON: () => ({name: 'command002'})},
        isLocked: false
      }
    }
  }
}))

describe(path, function() {
  let db = null

  const res = {
    send:       jest.fn(),
    sendStatus: jest.fn(),
  }

  const guild = {
    id: 'guild001',
    commands: {
      fetch: jest.fn(),
      create: jest.fn(),
      delete: jest.fn()
    }
  }

  const guildCommands = new Collection()

  beforeAll(async function() {
    db = await database

    await db.migrate()

    await db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['mod001', 'guild001', true])
  })

  beforeEach(function() {
    clientMock.guilds.fetch.mockResolvedValue(guild)
    guild.commands.fetch.mockResolvedValue(guildCommands)
    guild.commands.create.mockImplementation(async function(data) {
      const cmd = guildCommands.set(data.id, data)
      return cmd
    })
    guild.commands.delete.mockImplementation(async cmd => guildCommands.delete(cmd.id))
  })

  afterEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  describe('PUT', function() {
    const cb = callbacks.put[path]
    let req = null
    
    beforeEach(function() {
      req = {
        method: 'PUT',
        originalUrl: path,
        params: {
          guild: 'guild001',
          module: 'mod001',
          command: 'command001'
        },
        body: {
          isEnabled: true
        }
      }
    })
    
    it('should enable commands', async function() {
      await cb(req, res)

      expect(guild.commands.create).toHaveBeenCalledWith({name: 'command001'})
      expect(guild.commands.delete).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(200)
    })

    it('should disable commands', async function() {
      req.body.isEnabled = false

      await cb(req, res)

      expect(guild.commands.create).not.toHaveBeenCalled()
      expect(guild.commands.delete).toHaveBeenCalledWith({name: 'command001'})
      expect(res.sendStatus).toHaveBeenCalledWith(200)
    })

    it('should enable the command\'s module if it\'s disabled when enabeling the command', async function() {
      await db.run('UPDATE modules SET isEnabled = ? WHERE guildId = ?', false, 'guild001')

      expect(await db.all('SELECT * FROM modules')).toEqual([
        {id: 'mod001', guildId: 'guild001', isEnabled: 0}
      ])

      await cb(req, res)

      expect(await db.all('SELECT * FROM modules')).toEqual([
        {id: 'mod001', guildId: 'guild001', isEnabled: 1}
      ])
    })

    it('should respond with a 500 status code if the command was not created', async function() {
      guild.commands.create.mockRejectedValue('Error message')

      await cb(req, res)

      expect(console.error).toHaveBeenCalledWith('PUT', path, 'Error message')
      expect(res.sendStatus).toHaveBeenCalledWith(500)
    })

    it('should respond with a 404 status code if the command does not exist', async function() {
      req.params.command = 'command999'

      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(404)
    })

    it.todo('should respond with a 404 status code if the module does not exist')

    it('should respond with a 404 status code if the guild does not exist', async function() {
      clientMock.guilds.fetch.mockRejectedValue('Error message')

      await cb(req, res)

      expect(console.error).toHaveBeenCalledWith('PUT', path, 'Error message')
      expect(res.sendStatus).toHaveBeenCalledWith(404)
    })

    it('should respond with a 400 status code if the request body does not contain the "isEnabled" property', async function() {
      req.body = {}

      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(400)
    })

    it('should respond with a 500 status code if something went wrong', async function() {
      req.body = null

      await cb(req, res)

      expect(console.error).toHaveBeenCalledWith('PUT', path, expect.anything())
      expect(res.sendStatus).toHaveBeenCalledWith(500)
    })
  })
})