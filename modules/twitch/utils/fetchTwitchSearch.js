import fetch from 'node-fetch'

import fetchTwitchToken from './fetchTwitchToken.js'

export default async function fetchTwitchSearch({ query, type = 'channels' }, isTokenExpired = false) {
  try {
    const uri = `https://api.twitch.tv/helix/search/${type}/?query=${encodeURIComponent(query)}`
    const init = {
      headers: {
        'Client-Id': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${await fetchTwitchToken(isTokenExpired)}`
      }
    }

    const res = await fetch(uri, init)

    if (401 === res.status && !isTokenExpired) {
      return fetchTwitchSearch({query, type}, true)
    }

    const data = await res.json()

    return data.data || []

  } catch (err) {
    console.error(err)
    return []
  }
}