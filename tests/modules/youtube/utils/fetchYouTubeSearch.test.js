import fetchMock from 'node-fetch'

import fetchYouTubeSearch from '../../../../modules/youtube/utils/fetchYouTubeSearch.js'

describe('modules.youtube.utils.fetchYouTubeSearch()', function() {

  beforeAll(function() {
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

  it('Should respond with an array of search results', async function() {
    const results = await fetchYouTubeSearch({query: 'foo bar'})

    expect(console.error).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=foo%20bar&type=channel&maxResults=10&key=google_api_key',
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )
    expect(results).toEqual(['foo', 'bar'])
  })

  it('Should generate an API URI', async function() {
    const results = await fetchYouTubeSearch({query: 'foo bar', limit: 99, type: 'baz'})
    
    expect(console.error).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=foo%20bar&type=baz&maxResults=99&key=google_api_key',
      expect.anything()
    )
    expect(results).toEqual(['foo', 'bar'])
  })

  it('Should handle there being no results', async function() {
    fetchMock.mockResolvedValue({
      json: async () => ({items: []})
    })

    const results001 = await fetchYouTubeSearch({query: 'foobar'})

    fetchMock.mockResolvedValue({
      json: async () => ({})
    })

    const results002 = await fetchYouTubeSearch({query: 'foobar'})

    expect(console.error).not.toHaveBeenCalled()
    expect(results001).toEqual([])
    expect(results002).toEqual([])
  })
  
  it('Should handle the request failing', async function() {
    fetchMock.mockRejectedValue('Error')

    const results = await fetchYouTubeSearch({query: 'foobar'})

    expect(console.error).toHaveBeenCalledWith('Error')
    expect(results).toEqual([])
  })
  
})
