import express from 'express'
import bodyParser from 'body-parser'
import supertest from 'supertest'
import { Collection } from 'discord.js'

import database from '../../../database/index.js'
import clientMock from '../../../discord/client.js'

import commandsRouter from '../../../routes/commands/index.js'

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

describe('/api/commands/:guild/:module/:command', function() {
  let app = null
  let db = null
  const URI = '/api/commands/guild001/mod001/command001'

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
    app = express()

    app.use(bodyParser.json())
    app.use('/api/commands', commandsRouter)

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
    it('should enable commands', async function() {
      const res = await supertest(app).put(URI).send({isEnabled: true})

      expect(guild.commands.create).toHaveBeenCalledWith({name: 'command001'})
      expect(guild.commands.delete).not.toHaveBeenCalled()
      expect(res.status).toEqual(200)
    })

    it('should disable commands', async function() {
      const res = await supertest(app).put(URI).send({isEnabled: false})

      expect(guild.commands.create).not.toHaveBeenCalled()
      expect(guild.commands.delete).toHaveBeenCalledWith({name: 'command001'})
      expect(res.status).toEqual(200)
    })

    it('should enable the command\'s module if it\'s disabled when enabeling the command', async function() {
      await db.run('UPDATE modules SET isEnabled = ? WHERE guildId = ?', false, 'guild001')

      expect(await db.all('SELECT * FROM modules')).toEqual([
        {id: 'mod001', guildId: 'guild001', isEnabled: 0}
      ])

      await supertest(app).put(URI).send({isEnabled: true})

      expect(await db.all('SELECT * FROM modules')).toEqual([
        {id: 'mod001', guildId: 'guild001', isEnabled: 1}
      ])
    })

    it('should respond with a 500 status code if the command was not created', async function() {
      guild.commands.create.mockRejectedValue('Error message')

      const res = await supertest(app).put(URI).send({isEnabled: true})

      expect(console.error).toHaveBeenCalledWith('PUT', URI, 'Error message')
      expect(res.status).toEqual(500)
    })

    it('should respond with a 404 status code if the command does not exist', async function() {
      const res =
        await supertest(app)
          .put('/api/commands/guild001/mod001/command999')
          .send({isEnabled: true})

      expect(res.status).toEqual(404)
    })

    it.todo('should respond with a 404 status code if the module does not exist')

    it('should respond with a 404 status code if the guild does not exist', async function() {
      clientMock.guilds.fetch.mockRejectedValue('Error message')

      const res = await supertest(app).put(URI).send({isEnabled: true})

      expect(console.error).toHaveBeenCalledWith('PUT', URI, 'Error message')
      expect(res.status).toEqual(404)
    })

    it('should respond with a 400 status code if the request body does not contain the "isEnabled" property', async function() {
      const res = await supertest(app).put(URI).send({})

      expect(res.status).toEqual(400)
    })

    it('should respond with a 500 status code if something went wrong', async function() {
      jest.spyOn(db, 'get').mockRejectedValue('Database error')
      const res = await supertest(app).put(URI).send({isEnabled: true})

      expect(console.error).toHaveBeenCalledWith('PUT', URI, expect.anything())
      expect(res.status).toEqual(500)

      db.get.mockRestore()
    })
  })
})