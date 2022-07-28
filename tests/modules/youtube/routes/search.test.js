import { callbacks } from '../../../../routes/router.js'
import fetchYouTubeSearchMock from '../../../../modules/youtube/utils/fetchYouTubeSearch.js'

import '../../../../modules/youtube/routes/search.js'

jest.mock(
  '../../../../modules/youtube/utils/fetchYouTubeSearch.js',
  () => ({__esModule: true, default: jest.fn()})
)

const path = '/api/youtube/search'

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
        limit: 10,
        type: 'foo'
      },
    }

    it('Should respond with an array of search results', async function() {
      fetchYouTubeSearchMock.mockResolvedValue(['foo', 'bar'])

      await cb(req, res)

      expect(fetchYouTubeSearchMock).toHaveBeenCalledWith({query: 'query001', limit: 10, type: 'foo'})
      expect(res.sendStatus).not.toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith(['foo', 'bar'])
    })

    it('Should handle there being no search results', async function() {
      fetchYouTubeSearchMock.mockResolvedValue([])

      await cb(req, res)

      expect(res.sendStatus).not.toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith([])
    })
  })
})