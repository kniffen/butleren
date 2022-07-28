import fetchMock from 'node-fetch'

import fetchYouTubeActivities from '../../../../modules/youtube/utils/fetchYouTubeActivities.js'

describe('modules.youtube.utils.fetchYouTubeActivities()', function() {

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

  it('Should respond with an array of activities', async function() {
    const activities = await fetchYouTubeActivities({channelId: 'foobar'})

    expect(console.error).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://youtube.googleapis.com/youtube/v3/activities?part=snippet&part=contentDetails&channelId=foobar&maxResults=10&publishedAfter=1970-01-01T00:00:00Z&key=google_api_key',
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )
    expect(activities).toEqual(['foo', 'bar'])
  })

  it('Should generate an API URI', async function() {
    const activities = await fetchYouTubeActivities({channelId: 'foobar', limit: 99, publishedAfter: 'baz'})
    
    expect(console.error).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://youtube.googleapis.com/youtube/v3/activities?part=snippet&part=contentDetails&channelId=foobar&maxResults=99&publishedAfter=baz&key=google_api_key',
      expect.anything()
    )
    expect(activities).toEqual(['foo', 'bar'])
  })

  it('Should handle there being no activities', async function() {
    fetchMock.mockResolvedValue({
      json: async () => ({items: []})
    })

    const activities001 = await fetchYouTubeActivities({channelId: 'foobar'})

    fetchMock.mockResolvedValue({
      json: async () => ({})
    })

    const activities002 = await fetchYouTubeActivities({channelId: 'foobar'})

    expect(console.error).not.toHaveBeenCalled()
    expect(activities001).toEqual([])
    expect(activities002).toEqual([])
  })
  
  it('Should handle the request failing', async function() {
    fetchMock.mockRejectedValue('Error')

    const results = await fetchYouTubeActivities({channelId: 'foobar'})

    expect(console.error).toHaveBeenCalledWith('Error')
    expect(results).toEqual([])
  })

})
