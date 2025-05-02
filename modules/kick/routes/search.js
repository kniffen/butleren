import { router } from './router.js';
import { getKickChannels } from '../utils/getKickChannels.js';

router.get('/search', async function(req, res) {
  const results = await getKickChannels({slugs: [req.query.q] });
  res.send(results);
});