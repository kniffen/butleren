import { callbacks } from '../../../../routes/router.js'
import fetchSpotifySearchMock from '../../../../modules/spotify/utils/fetchSpotifySearch.js'

import '../../../../modules/spotify/routes/search.js'

jest.mock(
  '../../../../modules/spotify/utils/fetchSpotifySearch.js',
  () => ({__esModule: true, default: jest.fn()})
)

const path = '/api/spotify/search'

describe(path, function() {
  const res = {
    send: jest.fn(),
    sendStatus: jest.fn(),
  }

  describe('GET', function() {
    const cb = callbacks.get[path]

    const req = {
      query: {
        q:      'query001',
        type:   'type001',
        market: 'market001',
        limit:  'limit001'
      },
    }

    it('Should respond with an array of search results', async function() {
      fetchSpotifySearchMock.mockResolvedValue([
        {
          id: 'result001',
          name: 'result001.name',
          description: 'result001.description',
          images: [
            {url: 'result001.url001'},
            {url: 'result001.url002'},
            {url: 'result001.url003'},
          ]
        },
        {
          id: 'result002',
          name: 'result002.name',
          description: 'result002.description',
          images: [
            {url: 'result002.url001'},
            {url: 'result002.url002'},
            {url: 'result002.url003'},
          ]
        },
      ])
      
      await cb(req, res)

      expect(fetchSpotifySearchMock).toHaveBeenCalledWith('query001', 'type001', 'market001', 'limit001')
      expect(res.send).toHaveBeenCalledWith([
        {
          id: 'result001',
          name: 'result001.name',
          description: 'result001.description',
          thumbnailURL: 'result001.url002',
        },
        {
          id: 'result002',
          name: 'result002.name',
          description: 'result002.description',
          thumbnailURL: 'result002.url002',
        },
      ])
    })

    it('Should handle there being no search results', async function() {
      fetchSpotifySearchMock.mockResolvedValue([])
      
      await cb(req, res)

      expect(res.send).toHaveBeenCalledWith([])
    })
  })
})