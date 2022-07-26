import router   from '../../../routes/router.js'

import fetchTwitterUsers from '../utils/fetchTwitterUsers.js'

const path = '/api/twitter/search'

router.get(path, async function(req, res) {
  const results = await fetchTwitterUsers({usernames: [req.query.q]})
  res.send(results)
})