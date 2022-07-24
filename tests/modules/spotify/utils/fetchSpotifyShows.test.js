import fetchMock from 'node-fetch'

import fetchSpotifyShows from '../../../../modules/spotify/utils/fetchSpotifyShows.js'
import fetchSpotifyTokenMock from '../../../../modules/spotify/utils/fetchSpotifyToken.js'

jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock(
  '../../../../modules/spotify/utils/fetchSpotifyToken.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('moduled.spotify.utils.fetchSpotifyShows()', function() {
  beforeAll(function() {
    fetchSpotifyTokenMock.mockResolvedValue('spotifyToken')
    fetchMock.mockResolvedValue({
      json: async () => ({shows: ['foo', 'bar']})
    })
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  it('Should return an array of shows', async function() {
    const results = await fetchSpotifyShows(['show001', 'show002'])

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/shows?ids=show001,show002&market=US',
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
    await fetchSpotifyShows(['show001', 'show002'], 'market001')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/shows?ids=show001,show002&market=market001',
      expect.anything()
    )
  })

  it('Should invalid arguments being passed', async function() {
    const results = await Promise.all([
      fetchSpotifyShows('foo'),
      fetchSpotifyShows(55),
      fetchSpotifyShows(true),
      fetchSpotifyShows(false),
      fetchSpotifyShows(null),
      fetchSpotifyShows(undefined),
      fetchSpotifyShows({}),
      fetchSpotifyShows([]),
    ])

    expect(console.error).toHaveBeenCalledTimes(0)
    expect(fetchMock).toHaveBeenCalledTimes(0)
    expect(results).toEqual([
      [], // string
      [], // number
      [], // boolean true
      [], // boolean false
      [], // null
      [], // undefined
      [], // Object
      [], // Empty array
    ])
  })

  it('Should handle there being no shows', async function() {
    fetchMock.mockResolvedValue({
      json: async () => ([])
    })

    const results = await fetchSpotifyShows(['show001', 'show002'])

    expect(results).toEqual([])
  })

  it('Should handle the token being invalid', async function() {
    fetchMock.mockResolvedValue({status: 401})

    const results = await fetchSpotifyShows(['show001', 'show002'])

    expect(fetchSpotifyTokenMock).toHaveBeenCalledTimes(2)
    expect(fetchSpotifyTokenMock).toHaveBeenNthCalledWith(1, false)
    expect(fetchSpotifyTokenMock).toHaveBeenNthCalledWith(2, true)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenNthCalledWith(1, 'https://api.spotify.com/v1/shows?ids=show001,show002&market=US', expect.anything())
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://api.spotify.com/v1/shows?ids=show001,show002&market=US', expect.anything())

    expect(results).toEqual([])
  })

  it('Should handle the request failing', async function() {
    fetchMock.mockRejectedValue('Error message')

    const results = await fetchSpotifyShows(['show001', 'show002'])

    expect(console.error).toHaveBeenCalledWith('Error message')
    expect(results).toEqual([])
  })
})
