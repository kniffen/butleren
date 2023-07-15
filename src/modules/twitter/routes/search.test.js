import express from 'express'
import supertest from 'supertest'

import fetchTwitterUsersMock from '../utils/fetchTwitterUsers.js'
import twitterRouter from  './index.js'

jest.mock(
  '../utils/fetchTwitterUsers.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('/api/twitter/search', function() {
  const URI = '/api/twitter/search?q=query001'
  let app = null

  beforeAll(function() {
    app = express()

    app.use('/api/twitter', twitterRouter)
  })
  
  describe('GET', function() {
    const data = [
      {
        id: 'result001',
        name: 'result001.name',
        profile_image_url: 'result001.url001',
      },
      {
        id: 'result002',
        name: 'result002.name',
        profile_image_url: 'result002.url001',
      }
    ]

    it('Should respond with an array of search results', async function() {
      fetchTwitterUsersMock.mockResolvedValue(data)
      
      const res = await supertest(app).get(URI)

      expect(fetchTwitterUsersMock).toHaveBeenCalledWith({usernames: ['query001']})
      expect(res.body).toEqual(data)
    })

    it('Should handle there being no search results', async function() {
      fetchTwitterUsersMock.mockResolvedValue([])
      
      const res = await supertest(app).get(URI)

      expect(res.body).toEqual([])
    })
  })
})