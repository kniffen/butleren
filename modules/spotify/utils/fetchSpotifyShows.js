import fetch from 'node-fetch'

import fetchSpotifyToken from './fetchSpotifyToken.js'

export default async function fetchSpotifyShows(ids = [], market = 'US', isTokenExpired = false) {
  if (!Array.isArray(ids) || ids.length < 1) return []

  try {
    const uri = `https://api.spotify.com/v1/shows?ids=${ids.join(',')}&market=${market}`
    const init = {
      headers: {
        Authorization: `Bearer ${await fetchSpotifyToken(isTokenExpired)}`,
        'Content-Type': 'application/json'
      }
    }

    const res = await fetch(uri, init)

    if (401 === res.status && !isTokenExpired)
      return fetchSpotifyShows(ids, market, true)

    const data = await res.json()

    return data.shows || []

  } catch(err) {
    console.error(err)
    return []
  }
}