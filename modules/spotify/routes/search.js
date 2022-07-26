import router   from '../../../routes/router.js'

import fetchSpotifySearch from '../utils/fetchSpotifySearch.js'

const path = '/api/spotify/search'

router.get(path, async function(req, res) {
  const results = await fetchSpotifySearch(req.query.q, req.query.type, req.query.market, req.query.limit)

  res.send(results.map(result => ({
    id:           result.id,
    name:         result.name,
    description:  result.description,
    thumbnailURL: result.images[1].url
  })))
})