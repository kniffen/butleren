import fetch from 'node-fetch'

import fetchTwitchToken from './fetchTwitchToken.js'
import { logger } from '../../../logger/logger.js'

export default async function fetchTwitchSearch({ query, type = 'channels' }, isTokenExpired = false) {
  try {
    const uri = `https://api.twitch.tv/helix/search/${type}/?query=${encodeURIComponent(query)}`
    const init = {
      headers: {
        'Client-Id': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${await fetchTwitchToken(isTokenExpired)}`
      }
    }

    logger.info('Twitch API: /search request', {uri});
    const res = await fetch(uri, init)
    logger.info('Twitch API: /search response', {status: res.status});

    if (401 === res.status && !isTokenExpired) {
      return fetchTwitchSearch({query, type}, true)
    }

    const data = await res.json()
    logger.debug('Twitch API: /search response body', {data});

    return data.data || []

  } catch (err) {
    logger.error('Twitch API: /search', err);
    console.error(err)
    return []
  }
}