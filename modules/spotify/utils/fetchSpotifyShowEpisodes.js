import fetch from 'node-fetch'

import fetchSpotifyToken from'./fetchSpotifyToken.js'
import { logger } from '../../../logger/logger.js'

export default async function fetchShowEpisodes(id, market = 'US', isTokenExpired = false) {
  try {
    const url = `https://api.spotify.com/v1/shows/${id}/episodes/?market=${market}`;
    const init = {
      headers: {
        Authorization: `Bearer ${await fetchSpotifyToken(isTokenExpired)}`,
        'Content-Type': 'application/json'
      }
    }

    logger.info(`Spotify API: /shows/${id}/episodes request`, {url});
    const res = await fetch(url, init)
    logger.info(`Spotify API: /shows/${id}/episodes response`, {status: res.status});

    if (401 === res.status && !isTokenExpired) return fetchShowEpisodes(id, market, true)

    const data = await res.json()
    logger.debug(`Spotify API: /shows/${id}/episodes response body`, {data});

    return data.items || []

  } catch(err) {
    logger.error(`Spotify API: /shows/${id}/episodes`, err);
    console.error(err)
    return []
  }
}