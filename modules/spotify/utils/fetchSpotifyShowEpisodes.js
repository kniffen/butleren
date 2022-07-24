import fetch from 'node-fetch'

import fetchSpotifyToken from'./fetchSpotifyToken.js'

export default async function fetchShowEpisodes(id, market = 'US', isTokenExpired = false) {
  try {
    const init = {
      headers: {
        Authorization: `Bearer ${await fetchSpotifyToken(isTokenExpired)}`,
        'Content-Type': 'application/json'
      }
    }

    const res = await fetch(`https://api.spotify.com/v1/shows/${id}/episodes/?market=${market}`, init)
    
    if (401 === res.status && !isTokenExpired) return fetchShowEpisodes(id, market, true)
    
    const data = await res.json()

    return data.items || []

  } catch(err) {
    console.error(err)
    return []
  }
}