import supertest from 'supertest'
import express from 'express'

import spotifyRouter from '../../../../modules/spotify/routes/index.js'
import fetchSpotifySearchMock from '../../../../modules/spotify/utils/fetchSpotifySearch.js'

import '../../../../modules/spotify/routes/search.js'

jest.mock(
  '../../../../modules/spotify/utils/fetchSpotifySearch.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('/api/spotify/search', function() {
  let app = null

  beforeAll(function() {
    app = express()
    app.use('/api/spotify', spotifyRouter)
  })

  describe('GET', function() {
    const URI = '/api/spotify/search?q=query001&type=type001&market=market001&limit=limit001'
    
    it('Should respond with an array of search results', async function() {
      fetchSpotifySearchMock.mockResolvedValue([
        {
          id: 'result001',
          name: 'result001.name',
          description: 'result001.description',
          images: [
            {url: 'result001.url001'},
            {url: 'result001.url002'},
            {url: 'result001.url003'},
          ]
        },
        {
          id: 'result002',
          name: 'result002.name',
          description: 'result002.description',
          images: [
            {url: 'result002.url001'},
            {url: 'result002.url002'},
            {url: 'result002.url003'},
          ]
        },
      ])
      
      const res = await supertest(app).get(URI)

      expect(fetchSpotifySearchMock).toHaveBeenCalledWith('query001', 'type001', 'market001', 'limit001')
      expect(res.body).toEqual([
        {
          id: 'result001',
          name: 'result001.name',
          description: 'result001.description',
          thumbnailURL: 'result001.url002',
        },
        {
          id: 'result002',
          name: 'result002.name',
          description: 'result002.description',
          thumbnailURL: 'result002.url002',
        },
      ])
    })

    it('Should handle there being no search results', async function() {
      fetchSpotifySearchMock.mockResolvedValue([])
      
      const res = await supertest(app).get(URI)

      expect(res.body).toEqual([])
    })
  })
})