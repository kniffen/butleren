import { callbacks } from '../../../../routes/router.js'
import fetchTwitchSearchMock from '../../../../modules/twitch/utils/fetchTwitchSearch.js'

import '../../../../modules/twitch/routes/search.js'

jest.mock(
  '../../../../modules/twitch/utils/fetchTwitchSearch.js',
  () => ({__esModule: true, default: jest.fn()})
)

const path = '/api/twitch/search'

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
        type: 'foobar'
      },
    }

    it('Should respond with an array of search results', async function() {
      fetchTwitchSearchMock.mockResolvedValue(['foo', 'bar'])
      
      await cb(req, res)

      expect(fetchTwitchSearchMock).toHaveBeenCalledWith({query: 'query001', type: 'foobar'})
      expect(res.send).toHaveBeenCalledWith(['foo', 'bar'])
    })

    it('Should handle there being no search results', async function() {
      fetchTwitchSearchMock.mockResolvedValue([])
      
      await cb(req, res)

      expect(res.send).toHaveBeenCalledWith([])
    })
  })
})