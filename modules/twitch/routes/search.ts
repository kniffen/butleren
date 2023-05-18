import { Request, Response } from 'express';

import router from './router';
import fetchTwitchSearch from '../utils/fetchTwitchSearch';

type SearchType = Parameters<typeof fetchTwitchSearch>[0]['type'];

const isInputSearchType = (input?: string): input is SearchType =>
  (!input) ? true : ['categories', 'channels'].includes(input);

router.get('/search', async function (req: Request, res: Response) {
  try {
    const query = req.query.q?.toString();
    const type = req.query.type?.toString();

    if (!query || !isInputSearchType(type)) return res.sendStatus(400);

    const results = await fetchTwitchSearch({ query, type });
    res.send(results);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});