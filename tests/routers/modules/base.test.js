import express from 'express'
import supertest from 'supertest'

import database from '../../../database/index.js'
import modulesRouter from '../../../routes/modules/index.js'

jest.mock('../../../database/index.js', () => {
  const sqlite3 = jest.requireActual('sqlite3')
  const { open } = jest.requireActual('sqlite')

  return {
    __esModule: true,
    default: open({
      filename: ':memory:',
      driver: sqlite3.Database,
    })
  }
})

jest.mock('../../../modules/index.js', () => ({
  __esModule: true,
  mod001: {
    id: 'module001',
    name: 'moduleName001',
    description: 'moduleDescription001',
    isLocked: false,
    commands: {
      cmd001: {
        data: {name: 'command001'}
      }
    }
  },
  mod002: {
    id: 'module002',
    name: 'moduleName002',
    description: 'moduleDescription002',
    isLocked: false
  },
  mod003: {
    id: 'module003',
    name: 'moduleName003',
    description: 'moduleDescription003',
    isLocked: true
  },
}))


describe('/api/modules/:guild', function() {
  const app = express()
  let db = null

  beforeAll(async function() {
    app.use('/api/modules', modulesRouter)

    db = await database

    await db.migrate()
    await db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['module001', 'guild001', true])
    await db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['module002', 'guild001', false])
    await db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['module001', 'guild002', false])
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
    db.close()
  })

  describe('GET', function() {
    it('should respond with all the module data for the specified guild', async function() {
      const res = await supertest(app).get('/api/modules/guild001')

      expect(res.body).toEqual([
        {
          id:          undefined,
          name:        undefined,
          description: undefined,
          commands:    [],
          isEnabled:   true,
          isLocked:    undefined,
        },
        {
          id:          'module001',
          name:        'moduleName001',
          description: 'moduleDescription001',
          commands:    [{name: 'command001'}],
          isEnabled:   true,
          isLocked:    false,
        },
        {
          id:          'module002',
          name:        'moduleName002',
          description: 'moduleDescription002',
          commands:    [],
          isEnabled:   false,
          isLocked:    false,
        },
        {
          id:          'module003',
          name:        'moduleName003',
          description: 'moduleDescription003',
          commands:    [],
          isEnabled:   true,
          isLocked:    true,
        }
      ])
    })

    it('should respond with a 404 of the guild has no modules in the database', async function() {
      const res = await supertest(app).get('/api/modules/guild999')

      expect(res.status).toEqual(404)
    })

    it('should respond with a 500 status code if there was an issue reading the database', async function() {
      jest.spyOn(db, 'all').mockRejectedValue('SQL error')
      
      const res = await supertest(app).get('/api/modules/guild001')

      expect(res.status).toEqual(500)
      expect(console.error).toHaveBeenCalledWith('GET', '/api/modules/guild001', 'SQL error')

      db.all.mockRestore()
    })
  })
})