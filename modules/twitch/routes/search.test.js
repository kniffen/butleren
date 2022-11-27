import express from 'express'
import supertest from 'supertest'

import fetchTwitchSearchMock from '../utils/fetchTwitchSearch.js'
import twitchRouter from './index.js'

jest.mock(
  '../utils/fetchTwitchSearch.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('/api/twitch/search', function() {
  const URI = '/api/twitch/search?q=query001&type=foobar'
  let app = null

  beforeAll(function() {
    app = express()

    app.use('/api/twitch', twitchRouter)
  })
  
  describe('GET', function() {
    it('Should respond with an array of search results', async function() {
      fetchTwitchSearchMock.mockResolvedValue(['foo', 'bar'])
      
      const res = await supertest(app).get(URI)

      expect(fetchTwitchSearchMock).toHaveBeenCalledWith({query: 'query001', type: 'foobar'})
      expect(res.body).toEqual(['foo', 'bar'])
    })

    it('Should handle there being no search results', async function() {
      fetchTwitchSearchMock.mockResolvedValue([])
      
      const res = await supertest(app).get(URI)

      expect(res.body).toEqual([])
    })
  })
})