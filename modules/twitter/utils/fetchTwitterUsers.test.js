import fetchMock from 'node-fetch'

import fetchTwitterUsers from './fetchTwitterUsers.js'
import fetchTwitterTokenMock from './fetchTwitterToken.js'

jest.mock(
  './fetchTwitterToken.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('modules.twitter.utils.fetchTwitterUsers()', function() {
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

  it('Should fetch users via IDs', async function() {
    const users = await fetchTwitterUsers({ids: ['user001', 'user002']})

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.twitter.com/2/users/?ids=user001,user002&user.fields=profile_image_url',
      {
        headers: {
          Authorization: 'Bearer twitterToken'
        }
      }
    )

    expect(users).toEqual(['foo', 'bar'])
  })
  
  it('Should fetch users via usernames', async function() {
    const users = await fetchTwitterUsers({usernames: ['username001', 'username002']})

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.twitter.com/2/users/by?usernames=username001,username002&user.fields=profile_image_url',
      {
        headers: {
          Authorization: 'Bearer twitterToken'
        }
      }
    )

    expect(users).toEqual(['foo', 'bar'])
  })
  
  it('Should handle there being no results', async function() {
    fetchMock.mockResolvedValue({json: async () => ({data: []})})
    const result001 = await fetchTwitterUsers({})

    fetchMock.mockResolvedValue({json: async () => ({})})
    const result002 = await fetchTwitterUsers({})

    expect(result001).toEqual([])
    expect(result002).toEqual([])
  })
  
  it('Should handle the token being expired', async function() {
    fetchMock.mockResolvedValue({status: 401})

    const results = await fetchTwitterUsers({})

    expect(fetchTwitterTokenMock).toHaveBeenCalledTimes(2)
    expect(fetchTwitterTokenMock).toHaveBeenNthCalledWith(1, false)
    expect(fetchTwitterTokenMock).toHaveBeenNthCalledWith(2, true)

    expect(fetchMock).toHaveBeenCalledTimes(2)

    expect(results).toEqual([])
  })
  
  it('Should handle the request failing', async function() {
    fetchMock.mockRejectedValue('Error message')

    const results = await fetchTwitterUsers({})

    expect(console.error).toHaveBeenCalledWith('Error message')
    expect(results).toEqual([])
  })
})