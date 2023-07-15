import router from './router';
import fetchYouTubeSearch from '../utils/fetchYouTubeSearch';

router.get('/search', async function(req, res) {
  const results = await fetchYouTubeSearch({
    query: req.query.q?.toString() || '',
    limit: req.query.limit ? parseInt(req.query.limit.toString()) : undefined,
    type: req.query.type?.toString()
  });

  res.send(results);
});