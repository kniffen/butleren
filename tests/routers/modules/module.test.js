import { Collection } from 'discord.js'

import database from '../../../database/index.js'
import { callbacks } from '../../../routes/router.js'
import clientMock from '../../../discord/client.js'

import '../../../routes/modules/module.js'

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
    id: 'module001',
    name: 'modulename001',
    description: 'moduledescription001',
    commands: {
      cmd001: {
        data: {
          name: 'command001',
          toJSON: () => 'commanddata001'
        }
      },
      cmd002: {
        data: {
          name: 'command002',
          toJSON: () => 'commanddata002'
        }
      }
    }
  },
  mod002: {
    id: 'module002',
    name: 'modulename002',
    description: 'moduledescription002',
    commands: {
      cmd003: {
        data: {
          name: 'command003',
          toJSON: () => 'commanddata003'
        }
      }
    }
  },
  mod003: {
    id: 'module003',
    name: 'modulename003',
    description: 'moduledescription003',
    commands: {
      cmd004: {
        data: {
          name: 'command004',
          toJSON: () => 'commanddata004'
        }
      }
    }
  }
}))

const path = '/api/modules/:guild/:module'

describe(path, function() {
  let db = null

  const res = {
    send:       jest.fn(),
    sendStatus: jest.fn(),
  }

  const guild = {
    id: 'guild001',
    commands: {
      fetch:  jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    }
  }

  const guildCommands = new Collection()

  guildCommands.set('guildCmd001', {name: 'command001'})
  guildCommands.set('guildCmd002', {name: 'command002'})
  guildCommands.set('guildCmd003', {name: 'command003'})
  guildCommands.set('guildCmd004', {name: 'command004'})

  beforeAll(async function() {
    db = await database

    await db.migrate()

    await db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['module001', 'guild001', false])
    await db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['module002', 'guild001', true])
    await db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['module001', 'guild002', true])
  })

  beforeEach(function () {
    clientMock.guilds.fetch.mockResolvedValue(guild)
    guild.commands.fetch.mockResolvedValue(guildCommands)
    guild.commands.delete.mockResolvedValue('applicationCommand')
    guild.commands.create.mockResolvedValue('applicationCommand')
  })

  afterEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
    db.close()
  })

  describe('GET', function() {
    let req = null
    const cb = callbacks.get[path]

    beforeEach(function() {
      req = {
        method: 'GET',
        originalUrl: path,
        params: {
          guild:  'guild001',
          module: 'module001'
        }
      }
    })

    it('should respond with data about the module', async function() {
      await cb(req, res)

      req.params.module = 'module002'
      await cb(req, res)

      req.params.module = 'module003'
      await cb(req, res)

      expect(res.send).toHaveBeenNthCalledWith(1, {
        id: 'module001',
        name: 'modulename001',
        description: 'moduledescription001',
        isEnabled: false,
        isLocked: false
      })

      expect(res.send).toHaveBeenNthCalledWith(2, {
        id: 'module002',
        name: 'modulename002',
        description: 'moduledescription002',
        isEnabled: true,
        isLocked: false
      })

      expect(res.send).toHaveBeenNthCalledWith(3, {
        id: 'module003',
        name: 'modulename003',
        description: 'moduledescription003',
        isEnabled: true,
        isLocked: true
      })
    })

    it('should handle getting data from the database being rejected', async function() {
      jest.spyOn(db, 'get').mockRejectedValue('Get from database error')

      await cb(req, res)

      expect(console.error).toHaveBeenCalledWith('GET', path, 'Get from database error')

      db.get.mockRestore()
    })

    it('should respond with a 404 status code if the module does not exist', async function() {
      req.params.module = 'module999'

      await cb(req, res)

      expect(res.send).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(404)
    })

    it('should respond with a 404 status code if the guild does not exist', async function() {
      clientMock.guilds.fetch.mockRejectedValue('Guild not found')

      await cb(req, res)

      expect(res.send).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(404)
      expect(console.error).toHaveBeenCalledWith('GET', path, 'Guild not found')
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
          guild: 'guild001',
          module: 'module001'
        },
        body: {
          isEnabled: true
        }
      }
    })

    it('should update module properties', async function() {
      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(await db.all('SELECT * FROM modules')).toEqual([
        {id: 'module001', guildId: 'guild001', isEnabled: 1},
        {id: 'module002', guildId: 'guild001', isEnabled: 1},
        {id: 'module001', guildId: 'guild002', isEnabled: 1},
      ])

      res.sendStatus.mockClear()
      req.body.isEnabled = false
      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(await db.all('SELECT * FROM modules')).toEqual([
        {id: 'module001', guildId: 'guild001', isEnabled: 0},
        {id: 'module002', guildId: 'guild001', isEnabled: 1},
        {id: 'module001', guildId: 'guild002', isEnabled: 1},
      ])
    })

    it('should create and delete commands associated with the module', async function() {
      await cb(req, res)

      expect(guild.commands.delete).not.toHaveBeenCalled()
      expect(guild.commands.create).toHaveBeenCalledTimes(2)
      expect(guild.commands.create).toHaveBeenNthCalledWith(1, 'commanddata001')
      expect(guild.commands.create).toHaveBeenNthCalledWith(2, 'commanddata002')

      req.body.isEnabled = false
      await cb(req, res)

      expect(guild.commands.create).toHaveBeenCalledTimes(2)
      expect(guild.commands.delete).toHaveBeenCalledTimes(2)
      expect(guild.commands.delete).toHaveBeenNthCalledWith(1, {name: 'command001'})
      expect(guild.commands.delete).toHaveBeenNthCalledWith(2, {name: 'command002'})
    })

    it('should respond with a 500 status code if there were issues updating the database', async function() {
      jest.spyOn(db , 'run').mockRejectedValue('Database update error')
      await cb(req, res)

      expect(res.send).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(500)
      expect(console.error).toHaveBeenCalledWith('PUT', path, 'Database update error')

      db.run.mockRestore()
    })

    it('should handle creating a command being rejected', async function() {
      guild.commands.create.mockRejectedValue('Commands create error')
      await cb(req, res)

      expect(res.send).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(console.error).toHaveBeenCalledWith('PUT', path, 'Commands create error')
    })

    it('should handle deleting a command being rejected', async function() {
      guild.commands.delete.mockRejectedValue('Commands delete error')
      req.body.isEnabled = false
      await cb(req, res)

      expect(res.send).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(console.error).toHaveBeenCalledWith('PUT', path, 'Commands delete error')
    })

    it('should respond with a 500 status code if fetching guild command was rejected', async function() {
      guild.commands.fetch.mockRejectedValue('Commands fetch error')
      await cb(req, res)

      expect(res.send).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(200)
      expect(console.error).toHaveBeenCalledWith('PUT', path, 'Commands fetch error')
    })

    it('should respond with a 404 status code if the module does not exist in the database', async function() {
      req.params.module = 'module999'
      await cb(req, res)

      expect(res.send).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(404)
    })

    it('should respond with a 500 status code if there was an rejection when reading the database', async function() {
      jest.spyOn(db, 'get').mockRejectedValue('Read database error')
      await cb(req, res)

      expect(res.send).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(500)

      db.get.mockRestore()
    })
    
    it('should respond with a 404 status code if the guild does not exist', async function() {
      req.params.guild = 'guild999'
      await cb(req, res)

      clientMock.guilds.fetch.mockRejectedValue('Guild not found')
      await cb(req, res)

      expect(res.send).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenNthCalledWith(1, 404)
      expect(res.sendStatus).toHaveBeenNthCalledWith(2, 404)
      expect(console.error).toHaveBeenCalledWith('PUT', path, 'Guild not found')
    })    
  })
})
