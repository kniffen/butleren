import fetchMock from 'node-fetch'

import fetchTwitchSearch from './fetchTwitchSearch.js'
import fetchTwitchTokenMock from './fetchTwitchToken.js'

jest.mock(
  './fetchTwitchToken.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('modules.twitch.utils.fetchTwitchSearch()', function() {
  beforeAll(function() {
    fetchTwitchTokenMock.mockResolvedValue('twitchToken')
    fetchMock.mockResolvedValue({
      json: async () => ({data: ['foo', 'bar']})
    })
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  it('Should return an array of search results', async function() {
    const results = await fetchTwitchSearch({query: 'foo bar'})

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.twitch.tv/helix/search/channels/?query=foo%20bar',
      {
        headers: {
          'Client-Id': 'twitch_client_id',
          'Authorization': 'Bearer twitchToken',
        }
      }
    )
    
    expect(results).toEqual(['foo', 'bar'])
  })

  it('Should use arguments in the URI', async function() {
    const results = await fetchTwitchSearch({query: 'foo bar', type: 'baz'})

    expect(fetchMock).toHaveBeenCalledWith('https://api.twitch.tv/helix/search/baz/?query=foo%20bar', expect.anything())
    expect(results).toEqual(['foo', 'bar'])
  })

  it('Should handle there being no search results', async function() {
    const results = []

    fetchMock.mockResolvedValue({json: async () => ({data: []})})
    results.push(await fetchTwitchSearch({query: 'foo bar'}))

    fetchMock.mockResolvedValue({json: async () => ({})})
    results.push(await fetchTwitchSearch({query: 'foo bar'}))

    expect(results).toEqual([[],[]])
  })
  
  it('Should handle the token being expired', async function() {
    fetchMock.mockResolvedValue({status: 401})

    const results = await fetchTwitchSearch({query: 'foo bar'})

    expect(fetchTwitchTokenMock).toHaveBeenCalledTimes(2)
    expect(fetchTwitchTokenMock).toHaveBeenNthCalledWith(1, false)
    expect(fetchTwitchTokenMock).toHaveBeenNthCalledWith(2, true)

    expect(fetchMock).toHaveBeenCalledTimes(2)

    expect(results).toEqual([])
  })

  it('Should handle the request failing', async function() {
    fetchMock.mockRejectedValue('Error message')

    const results = await fetchTwitchSearch({query: 'foo bar'})

    expect(console.error).toHaveBeenCalledWith('Error message')
    expect(results).toEqual([])
  })

})