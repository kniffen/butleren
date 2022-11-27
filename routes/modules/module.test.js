import express from 'express'
import supertest from 'supertest'
import bodyParser from 'body-parser'
import { Collection } from 'discord.js'

import database from '../../database/index.js'
import clientMock from '../../discord/client.js'

import modulesRouter from './index.js'

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

describe('/api/modules/:guild/:module', function() {
  const app = express()
  let db = null

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
    app.use(bodyParser.json())
    app.use('/api/modules', modulesRouter)

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
    it('should respond with data about the module', async function() {
      const res001 = await supertest(app).get('/api/modules/guild001/module001')
      const res002 = await supertest(app).get('/api/modules/guild001/module002')
      const res003 = await supertest(app).get('/api/modules/guild001/module003')
    
      expect(res001.body).toEqual({
        id: 'module001',
        name: 'modulename001',
        description: 'moduledescription001',
        isEnabled: false,
        isLocked: false
      })

      expect(res002.body).toEqual({
        id: 'module002',
        name: 'modulename002',
        description: 'moduledescription002',
        isEnabled: true,
        isLocked: false
      })

      expect(res003.body).toEqual({
        id: 'module003',
        name: 'modulename003',
        description: 'moduledescription003',
        isEnabled: true,
        isLocked: true
      })
    })

    it('should handle getting data from the database being rejected', async function() {
      jest.spyOn(db, 'get').mockRejectedValue('Get from database error')

      await supertest(app).get('/api/modules/guild001/module001')

      expect(console.error).toHaveBeenCalledWith('GET', '/api/modules/guild001/module001', 'Get from database error')

      db.get.mockRestore()
    })

    it('should respond with a 404 status code if the module does not exist', async function() {
      const res = await supertest(app).get('/api/modules/guild001/module999')

      expect(res.status).toEqual(404)
    })

    it('should respond with a 404 status code if the guild does not exist', async function() {
      clientMock.guilds.fetch.mockRejectedValue('Guild not found')

      const res = await supertest(app).get('/api/modules/guild001/module001')

      expect(res.status).toEqual(404)
      expect(console.error).toHaveBeenCalledWith('GET', '/api/modules/guild001/module001', 'Guild not found')
    })    
  })

  describe('PUT', function() {
    const URI = '/api/modules/guild001/module001'

    it('should update module properties', async function() {
      const res001 = await supertest(app).put(URI).send({isEnabled: true})

      expect(res001.status).toEqual(200)
      expect(await db.all('SELECT * FROM modules')).toEqual([
        {id: 'module001', guildId: 'guild001', isEnabled: 1},
        {id: 'module002', guildId: 'guild001', isEnabled: 1},
        {id: 'module001', guildId: 'guild002', isEnabled: 1},
      ])

      const res002 = await supertest(app).put(URI).send({isEnabled: false})

      expect(res002.status).toEqual(200)
      expect(await db.all('SELECT * FROM modules')).toEqual([
        {id: 'module001', guildId: 'guild001', isEnabled: 0},
        {id: 'module002', guildId: 'guild001', isEnabled: 1},
        {id: 'module001', guildId: 'guild002', isEnabled: 1},
      ])
    })

    it('should create and delete commands associated with the module', async function() {
      await supertest(app).put(URI).send({isEnabled: true})

      expect(guild.commands.delete).not.toHaveBeenCalled()
      expect(guild.commands.create).toHaveBeenCalledTimes(2)
      expect(guild.commands.create).toHaveBeenNthCalledWith(1, 'commanddata001')
      expect(guild.commands.create).toHaveBeenNthCalledWith(2, 'commanddata002')

      await supertest(app).put(URI).send({isEnabled: false})
      
      expect(guild.commands.create).toHaveBeenCalledTimes(2)
      expect(guild.commands.delete).toHaveBeenCalledTimes(2)
      expect(guild.commands.delete).toHaveBeenNthCalledWith(1, {name: 'command001'})
      expect(guild.commands.delete).toHaveBeenNthCalledWith(2, {name: 'command002'})
    })

    it('should respond with a 500 status code if there were issues updating the database', async function() {
      jest.spyOn(db , 'run').mockRejectedValue('Database update error')
      
      const res = await supertest(app).put(URI).send({isEnabled: true})

      expect(res.status).toEqual(500)
      expect(console.error).toHaveBeenCalledWith('PUT', URI, 'Database update error')

      db.run.mockRestore()
    })

    it('should handle creating a command being rejected', async function() {
      guild.commands.create.mockRejectedValue('Commands create error')
      
      const res = await supertest(app).put(URI).send({isEnabled: true})

      expect(res.status).toEqual(200)
      expect(console.error).toHaveBeenCalledWith('PUT', URI, 'Commands create error')
    })

    it('should handle deleting a command being rejected', async function() {
      guild.commands.delete.mockRejectedValue('Commands delete error')
      
      const res = await supertest(app).put(URI).send({isEnabled: false})

      expect(res.status).toEqual(200)
      expect(console.error).toHaveBeenCalledWith('PUT', URI, 'Commands delete error')
    })

    it('should respond with a 500 status code if fetching guild command was rejected', async function() {
      guild.commands.fetch.mockRejectedValue('Commands fetch error')
      
      const res = await supertest(app).put(URI).send({isEnabled: true})

      expect(res.status).toEqual(200)
      expect(console.error).toHaveBeenCalledWith('PUT', URI, 'Commands fetch error')
    })

    it('should respond with a 404 status code if the module does not exist in the database', async function() {
      const res = await supertest(app).put('/api/modules/guild001/module999').send({isEnabled: true})

      expect(res.status).toEqual(404)
    })

    it('should respond with a 500 status code if there was an rejection when reading the database', async function() {
      jest.spyOn(db, 'get').mockRejectedValue('Read database error')
      
      const res = await supertest(app).put(URI).send({isEnabled: true})

      expect(res.status).toEqual(500)

      db.get.mockRestore()
    })
    
    it('should respond with a 404 status code if the guild does not exist', async function() {
      const res001 = await supertest(app).put('/api/modules/guild999/module001').send({isEnabled: true})

      clientMock.guilds.fetch.mockRejectedValue('Guild not found')
      const res002 = await supertest(app).put('/api/modules/guild999/module001').send({isEnabled: true})

      expect(res001.status).toEqual(404)
      expect(res002.status).toEqual(404)
      expect(console.error).toHaveBeenCalledWith('PUT', '/api/modules/guild999/module001', 'Guild not found')
    })    
  })
})
