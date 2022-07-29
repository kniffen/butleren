import router from '../../../routes/router.js'

import fetchTwitchSearch from '../utils/fetchTwitchSearch.js'

const path = '/api/twitch/search'

router.get(path, async function(req, res) {
  const results = await fetchTwitchSearch({query: req.query.q, type: req.query.type})
  res.send(results)
})