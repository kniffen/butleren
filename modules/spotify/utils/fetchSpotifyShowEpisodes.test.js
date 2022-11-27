import fetchMock from 'node-fetch'

import fetchSpotifyShowEpisodes from './fetchSpotifyShowEpisodes.js'
import fetchSpotifyTokenMock from './fetchSpotifyToken.js'

jest.mock(
  './fetchSpotifyToken.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('moduled.spotify.utils.fetchSpotifyShowEpisodes()', function() {
  beforeAll(function() {
    fetchSpotifyTokenMock.mockResolvedValue('spotifyToken')
    fetchMock.mockResolvedValue({
      json: async () => ({items: ['foo', 'bar']})
    })
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  it('Should return an array of episodes for the show', async function() {
    const results = await fetchSpotifyShowEpisodes('foo')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/shows/foo/episodes/?market=US',
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
    await fetchSpotifyShowEpisodes('foo', 'bar')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/shows/foo/episodes/?market=bar',
      expect.anything()
    )
  })

  it('Should handle there being no episodes', async function() {
    fetchMock.mockResolvedValue({
      json: async () => ([])
    })

    const results = await fetchSpotifyShowEpisodes('foo')

    expect(results).toEqual([])
  })

  it('Should handle the token being invalid', async function() {
    fetchMock.mockResolvedValue({status: 401})

    const results = await fetchSpotifyShowEpisodes('foo')

    expect(fetchSpotifyTokenMock).toHaveBeenCalledTimes(2)
    expect(fetchSpotifyTokenMock).toHaveBeenNthCalledWith(1, false)
    expect(fetchSpotifyTokenMock).toHaveBeenNthCalledWith(2, true)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenNthCalledWith(1, 'https://api.spotify.com/v1/shows/foo/episodes/?market=US', expect.anything())
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://api.spotify.com/v1/shows/foo/episodes/?market=US', expect.anything())

    expect(results).toEqual([])
  })

  it('Should handle the request failing', async function() {
    fetchMock.mockRejectedValue('Error message')

    const results = await fetchSpotifyShowEpisodes('foo')

    expect(console.error).toHaveBeenCalledWith('Error message')
    expect(results).toEqual([])
  })
})
