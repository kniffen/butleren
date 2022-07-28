import router from '../../../routes/router.js'

import fetchYouTubeSearch from '../utils/fetchYouTubeSearch.js'

const path = '/api/youtube/search'

router.get(path, async function(req, res) {
  const results = await fetchYouTubeSearch({query: req.query.q, limit: req.query.limit, type: req.query.type})
  res.send(results)
})