import { callbacks } from '../../../routes/router.js'
import discordClientMock from '../../../discord/client.js'

import '../../../routes/guilds/roles.js'

jest.mock('../../../discord/client.js', () => ({
  __esModule: true,
  default: {
    guilds: {fetch: jest.fn()}
  }
}))

const path = '/api/guilds/:guild/roles'

describe(path, function() {
  const res = {
    send: jest.fn(),
    sendStatus: jest.fn(),
  }

  const guilds = new Map()
  const roles  = new Map()

  beforeAll(function() {
    guilds.set('guild001', {
      id: 'guild001',
      roles: {
        fetch: jest.fn(async () => roles)
      },
    })
    
    roles.set('role001', {id: 'role001', name: 'rolename001'})
    roles.set('role002', {id: 'role002', name: 'rolename002'})

    discordClientMock.guilds.fetch.mockImplementation((id) => {
      const guild = guilds.get(id)
      if (guild) return Promise.resolve(guild)
      return Promise.reject('Guild not found')
    })
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  describe('GET', function() {
    const cb = callbacks.get[path]

    const req = {
      method: 'GET',
      originalUrl: path,
      params: {guild: 'guild001'}
    }

    it('should respond with a list of available roles', async function() {
      await cb(req, res)

      expect(res.sendStatus).not.toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith([
        {id: 'role001', name: 'rolename001'},
        {id: 'role002', name: 'rolename002'},
      ])
    })

    it('should respond with a 404 error code if the guild could not be found', async function() {
      req.params.guild = 'guild999'
      await cb(req, res)

      expect(res.send).not.toHaveBeenCalled()
      expect(res.sendStatus).toHaveBeenCalledWith(404)
      expect(console.error).toHaveBeenCalledWith('GET', path, 'Guild not found')
    })
  })
})