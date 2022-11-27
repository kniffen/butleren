import express from 'express'
import supertest from 'supertest'

import fetchYouTubeSearchMock from '../utils/fetchYouTubeSearch.js'
import youtubeRouter from './index.js'

jest.mock(
  '../utils/fetchYouTubeSearch.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('/api/youtube/search', function() {
  let app = null
  const URI = '/api/youtube/search?q=query001&limit=10&type=foo'

  beforeAll(function() {
    app = express()

    app.use('/api/youtube', youtubeRouter)
  })
  
  describe('GET', function() {
    it('Should respond with an array of search results', async function() {
      fetchYouTubeSearchMock.mockResolvedValue(['foo', 'bar'])

      const res = await supertest(app).get(URI)

      expect(fetchYouTubeSearchMock).toHaveBeenCalledWith({query: 'query001', limit: '10', type: 'foo'})
      expect(res.body).toEqual(['foo', 'bar'])
    })

    it('Should handle there being no search results', async function() {
      fetchYouTubeSearchMock.mockResolvedValue([])

      const res = await supertest(app).get(URI)

      expect(res.body).toEqual([])
    })
  })
})