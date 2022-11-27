import fetchMock from 'node-fetch'

import fetchTwitterUserTweets from './fetchTwitterUserTweets.js'
import fetchTwitterTokenMock from './fetchTwitterToken.js'

jest.mock(
  './fetchTwitterToken.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('modules.twitter.utils.fetchTwitterUserTweets()', function() {
  beforeAll(function() {
    fetchTwitterTokenMock.mockResolvedValue('twitterToken')

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

  it('Should fetch tweets', async function() {
    const tweets = await fetchTwitterUserTweets('user001')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.twitter.com/2/users/user001/tweets?tweet.fields=created_at,author_id,in_reply_to_user_id,referenced_tweets,attachments,entities&exclude=retweets,replies',
      {
        headers: {
          Authorization: 'Bearer twitterToken'
        }
      }
    )

    expect(tweets).toEqual(['foo', 'bar'])
  })
  
  it('Should handle there being no tweets', async function() {
    fetchMock.mockResolvedValue({json: async () => ({data: []})})
    const result001 = await fetchTwitterUserTweets('user001')

    fetchMock.mockResolvedValue({json: async () => ({})})
    const result002 = await fetchTwitterUserTweets('user001')

    expect(result001).toEqual([])
    expect(result002).toEqual([])
  })
  
  it('Should handle the token being expired', async function() {
    fetchMock.mockResolvedValue({status: 401})

    const results = await fetchTwitterUserTweets('user001')

    expect(fetchTwitterTokenMock).toHaveBeenCalledTimes(2)
    expect(fetchTwitterTokenMock).toHaveBeenNthCalledWith(1, false)
    expect(fetchTwitterTokenMock).toHaveBeenNthCalledWith(2, true)

    expect(fetchMock).toHaveBeenCalledTimes(2)

    expect(results).toEqual([])
  })
  
  it('Should handle the request failing', async function() {
    fetchMock.mockRejectedValue('Error message')

    const results = await fetchTwitterUserTweets('user001')

    expect(console.error).toHaveBeenCalledWith('Error message')
    expect(results).toEqual([])
  })
})