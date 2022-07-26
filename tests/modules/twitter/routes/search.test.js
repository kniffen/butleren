import { callbacks } from '../../../../routes/router.js'
import fetchTwitterUsersMock from '../../../../modules/twitter/utils/fetchTwitterUsers.js'

import '../../../../modules/twitter/routes/search.js'

jest.mock(
  '../../../../modules/twitter/utils/fetchTwitterUsers.js',
  () => ({__esModule: true, default: jest.fn()})
)

const path = '/api/twitter/search'

describe(path, function() {
  const res = {
    send: jest.fn(),
    sendStatus: jest.fn(),
  }

  describe('GET', function() {
    const cb = callbacks.get[path]

    const req = {
      query: {
        q: 'query001',
      },
    }

    const data = [
      {
        id: 'result001',
        name: 'result001.name',
        profile_image_url: 'result001.url001',
      },
      {
        id: 'result002',
        name: 'result002.name',
        profile_image_url: 'result002.url001',
      }
    ]

    it('Should respond with an array of search results', async function() {
      fetchTwitterUsersMock.mockResolvedValue(data)
      
      await cb(req, res)

      expect(fetchTwitterUsersMock).toHaveBeenCalledWith({usernames: ['query001']})
      expect(res.send).toHaveBeenCalledWith(data)
    })

    it('Should handle there being no search results', async function() {
      fetchTwitterUsersMock.mockResolvedValue([])
      
      await cb(req, res)

      expect(res.send).toHaveBeenCalledWith([])
    })
  })
})