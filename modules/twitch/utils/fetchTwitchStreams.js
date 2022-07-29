import fetch from 'node-fetch'

import fetchTwitchToken from './fetchTwitchToken.js'

export default async function fetchTwitchStreams({ ids = [], usernames = []}, isTokenExpired = false) {
  try {
    if (1 > ids.length && 1 > usernames.length) return []

    const uri =
      0 < ids.length
        ? `https://api.twitch.tv/helix/streams?user_id=${ids.join('&user_id=')}`
        : `https://api.twitch.tv/helix/streams?user_login=${usernames.join('&user_login=')}`

    const init = {
      headers: {
        'Client-Id': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${await fetchTwitchToken(isTokenExpired)}`
      }
    }

    const res = await fetch(uri, init)

    if (401 === res.status && !isTokenExpired)
      return fetchTwitchStreams({ids, usernames}, true)

    const data = await res.json()

    return data.data || []

  } catch (err) {
    console.error(err)
    return []
  }
}