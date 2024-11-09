import fetch from 'node-fetch'

import fetchSpotifyToken from './fetchSpotifyToken.js'
import { logger } from '../../../logger/logger.js'

export default async function fetchSpotifyShows(ids = [], market = 'US', isTokenExpired = false) {
  if (!Array.isArray(ids) || 1 > ids.length) return []

  try {
    const uri = `https://api.spotify.com/v1/shows?ids=${ids.join(',')}&market=${market}`
    const init = {
      headers: {
        Authorization: `Bearer ${await fetchSpotifyToken(isTokenExpired)}`,
        'Content-Type': 'application/json'
      }
    }

    logger.info('Spotify API: /shows request', {uri});
    const res = await fetch(uri, init)
    logger.info('Spotify API: /shows response', {status: res.status});

    if (401 === res.status && !isTokenExpired)
      return fetchSpotifyShows(ids, market, true)

    const data = await res.json()
    logger.debug('Spotify API: /shows response body', {data});

    return data.shows || []

  } catch(err) {
    logger.error('Spotify API: /shows', err);
    console.error(err)
    return []
  }
}