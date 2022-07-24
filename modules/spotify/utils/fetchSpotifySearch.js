import fetch from 'node-fetch'

import fetchSpotifyToken from './fetchSpotifyToken.js'

export default async function fetchSpotifySearch(query, type = 'show', market = 'US', limit = 5, isTokenExpired = false) {
  try {
    const uri = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&market=${market}&limit=${limit}`
    const init = {
      headers: {
        Authorization: `Bearer ${await fetchSpotifyToken(isTokenExpired)}`,
        "Content-Type": "application/json"
      }
    }

    const res = await fetch(uri, init)

    if (401 === res.status && !isTokenExpired)
      return fetchSpotifySearch(query, type, market, limit, true)

    const data = await res.json()

    return data[type+'s'].items || []

  } catch(err) {
    console.error(err)
    return []
  }
}