import fetch from 'node-fetch'

import fetchSpotifyToken from './fetchSpotifyToken.js'
import { logger } from '../../../logger/logger.js'

export default async function fetchSpotifySearch(query, type = 'show', market = 'US', limit = 5, isTokenExpired = false) {
  try {
    const uri = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&market=${market}&limit=${limit}`
    const init = {
      headers: {
        Authorization: `Bearer ${await fetchSpotifyToken(isTokenExpired)}`,
        'Content-Type': 'application/json'
      }
    }

    logger.info('Spotify API: /search request', {uri});
    const res = await fetch(uri, init)
    logger.info('Spotify API: /search response', {status: res.status});

    if (401 === res.status && !isTokenExpired)
      return fetchSpotifySearch(query, type, market, limit, true)

    const data = await res.json()
    logger.debug('Spotify API: /search response body', {data});

    return data[`${type}s`].items || []

  } catch(err) {
    logger.error('Spotify API: /search', err);
    console.error(err)
    return []
  }
}