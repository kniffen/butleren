import router   from './router.js'
import fetchTwitterUsers from '../utils/fetchTwitterUsers.js'

router.get('/search', async function(req, res) {
  const results = await fetchTwitterUsers({usernames: [req.query.q]})
  res.send(results)
})