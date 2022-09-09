import router from './router.js'
import fetchTwitchSearch from '../utils/fetchTwitchSearch.js'

router.get('/search', async function(req, res) {
  const results = await fetchTwitchSearch({query: req.query.q, type: req.query.type})
  res.send(results)
})