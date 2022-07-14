// import database from '../../../database/index.js'
import { callbacks } from '../../../routes/router.js'

import '../../../routes/commands/index.js'

const path = '/api/commands/:guild'

describe(path, function() {
  const res = {
    send:       jest.fn(),
    sendStatus: jest.fn(),
  }

  beforeEach(function() {
    jest.clearAllMocks()
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

      expect(console.error).toHaveBeenCalledWith(null)
      expect(res.send).toHaveBeenCalledWith(null)
    })

    it.todo('Should handle there being no guild commands')

    it.todo('should respond with a 404 status code if there was an issue fetching commands from the guild')

    it.todo('should resport with a 404 status code if the guild does not exist')
  })
})