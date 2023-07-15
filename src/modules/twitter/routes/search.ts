import router   from './router';
import fetchTwitterUsers from '../utils/fetchTwitterUsers';

router.get('/search', async function(req, res) {
  const results = await fetchTwitterUsers({usernames: req.query.q ? [req.query.q?.toString()] : []});
  res.send(results);
});
