import fetchMock from 'node-fetch'

import fetchTwitterToken from '../../../../modules/twitter/utils/fetchTwitterToken.js'

describe('modules.twitter.utils.fetchTwitterToken()', function() {
  let access_token = 'twitterToken'

  beforeAll(function() {
    fetchMock.mockResolvedValue({
      json: () => ({access_token})
    })
  })

  beforeEach(function() {
    jest.clearAllMocks()  
  })

  afterAll(function() {
    jest.restoreAllMocks()  
  })

  it('Should return a new token', async function() {
    const token = await fetchTwitterToken()

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.twitter.com/oauth2/token',
      {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.TWITTER_API_KEY}:${process.env.TWITTER_API_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    expect(token).toEqual('twitterToken')
  })
  
  it('Should return a stored token', async function() {
    const token = await fetchTwitterToken()

    expect(fetchMock).not.toHaveBeenCalled()
    expect(token).toEqual('twitterToken')
  })

  it('Should replace an expired token', async function() {
    access_token = 'anotherTwitterToken'

    const token = await fetchTwitterToken(true)

    expect(fetchMock).toHaveBeenCalled()
    expect(token).toEqual('anotherTwitterToken')
  })
})