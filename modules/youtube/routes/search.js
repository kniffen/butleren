import router from './router.js'
import fetchYouTubeSearch from '../utils/fetchYouTubeSearch.js'

router.get('/search', async function(req, res) {
  const results = await fetchYouTubeSearch({query: req.query.q, limit: req.query.limit, type: req.query.type})
  res.send(results)
})