import fetchMock from 'node-fetch'

import fetchYouTubeChannels from './fetchYouTubeChannels.js'

describe('modules.youtube.utils.fetchYouTubeChannels()', function() {

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

  it('Should respond with an array of channels', async function() {
    const channels = await fetchYouTubeChannels({ids: ['foobar']})

    expect(console.error).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=foobar&key=google_api_key',
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )
    expect(channels).toEqual(['foo', 'bar'])
  })

  it('Should generate an API URI', async function() {
    const channels = await fetchYouTubeChannels({ids: ['foobar', 'baz', 'qux']})
    
    expect(console.error).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=foobar&id=baz&id=qux&key=google_api_key',
      expect.anything()
    )
    expect(channels).toEqual(['foo', 'bar'])
  })

  it('Should handle there being no channels', async function() {
    fetchMock.mockResolvedValue({
      json: async () => ({items: []})
    })

    const channels001 = await fetchYouTubeChannels({ids: ['foobar']})

    fetchMock.mockResolvedValue({
      json: async () => ({})
    })

    const channels002 = await fetchYouTubeChannels({ids: ['foobar']})

    expect(console.error).not.toHaveBeenCalled()
    expect(channels001).toEqual([])
    expect(channels002).toEqual([])
  })
  
  it('Should handle the request failing', async function() {
    fetchMock.mockRejectedValue('Error')

    const channels = await fetchYouTubeChannels({ids: []})

    expect(console.error).toHaveBeenCalledWith('Error')
    expect(channels).toEqual([])
  })

})
