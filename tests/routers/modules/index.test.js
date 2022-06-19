import database from '../../../database/index.js'
import { callbacks } from '../../../routes/router.js'

import '../../../routes/modules/index.js'

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
    commands: [{id: 'command001'}],
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

const path = '/api/modules/:guild'

describe(path, function() {
  let db = null

  const res = {
    send:       jest.fn(),
    sendStatus: jest.fn(),
  }

  beforeAll(async function() {
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
    const cb = callbacks.get[path]

    const req = {
      method: 'GET',
      originalUrl: path,
      params: {guild: 'guild001'}
    }
    
    it('should respond with all the module data for the specified guild', async function() {
      await cb(req, res)

      expect(res.sendStatus).not.toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith([
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
      req.params.guild = 'guild999'
      await cb(req, res)

      expect(res.sendStatus).toHaveBeenCalledWith(404)
      expect(res.send).not.toHaveBeenCalled()
    })

    it('should respond with a 500 status code if there was an issue reading the database', async function() {
      jest.spyOn(db, 'all').mockRejectedValue('SQL error')
      await cb(req, res)

      expect(res.send).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(500)
      expect(console.error).toHaveBeenCalledWith('GET', path, 'SQL error')

      db.all.mockRestore()
    })
  })
})