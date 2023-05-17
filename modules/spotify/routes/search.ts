import router from './router';
import { fetchSpotifySearch } from '../utils';

router.get('/search', async function (req, res) {
  try {
    const type = req.query.type?.toString();

    if (!type) return res.sendStatus(400);

    const results = await fetchSpotifySearch(
      req.query.q?.toString() || '',
      type,
      req.query.market?.toString(),
      Number(req.query.limit),
    );

    res.send(results);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});
