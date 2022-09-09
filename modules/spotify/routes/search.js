import router from './router.js'
import fetchSpotifySearch from '../utils/fetchSpotifySearch.js'

router.get('/search', async function(req, res) {
  const results = await fetchSpotifySearch(req.query.q, req.query.type, req.query.market, req.query.limit)

  res.send(results.map(result => ({
    id:           result.id,
    name:         result.name,
    description:  result.description,
    thumbnailURL: result.images[1].url
  })))
})
