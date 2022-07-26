import fetchMock from 'node-fetch'

import fetchSpotifySearch from '../../../../modules/spotify/utils/fetchSpotifySearch.js'
import fetchSpotifyTokenMock from '../../../../modules/spotify/utils/fetchSpotifyToken.js'

jest.mock(
  '../../../../modules/spotify/utils/fetchSpotifyToken.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('moduled.spotify.utils.fetchSpotifySearch()', function() {
  beforeAll(function() {
    fetchSpotifyTokenMock.mockResolvedValue('spotifyToken')
    fetchMock.mockResolvedValue({
      json: async () => ({shows: {items: ['foo', 'bar']}})
    })
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  it('Should return an array of search results', async function() {
    const results = await fetchSpotifySearch('foo')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/search?q=foo&type=show&market=US&limit=5',
      {
        headers: {
          Authorization: 'Bearer spotifyToken',
          'Content-Type': 'application/json'
        }
      }
    )
    
    expect(results).toEqual(['foo', 'bar'])
  })

  it('Should use arguments in the URI', async function() {
    await fetchSpotifySearch('foo', 'type001', 'market001', 'limit001')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/search?q=foo&type=type001&market=market001&limit=limit001',
      expect.anything()
    )
  })

  it('Should handle there being no search results', async function() {
    fetchMock.mockResolvedValue({
      json: async () => ([])
    })

    const results = await fetchSpotifySearch('foo')

    expect(results).toEqual([])
  })
  
  it('Should handle the token being invalid', async function() {
    fetchMock.mockResolvedValue({status: 401})

    const results = await fetchSpotifySearch('foo')

    expect(fetchSpotifyTokenMock).toHaveBeenCalledTimes(2)
    expect(fetchSpotifyTokenMock).toHaveBeenNthCalledWith(1, false)
    expect(fetchSpotifyTokenMock).toHaveBeenNthCalledWith(2, true)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenNthCalledWith(1, 'https://api.spotify.com/v1/search?q=foo&type=show&market=US&limit=5', expect.anything())
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://api.spotify.com/v1/search?q=foo&type=show&market=US&limit=5', expect.anything())

    expect(results).toEqual([])
  })

  it('Should handle the request failing', async function() {
    fetchMock.mockRejectedValue('Error message')

    const results = await fetchSpotifySearch('foo')

    expect(console.error).toHaveBeenCalledWith('Error message')
    expect(results).toEqual([])
  })
})
