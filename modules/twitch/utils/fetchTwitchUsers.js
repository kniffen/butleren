import fetch from 'node-fetch'

import fetchTwitchToken from './fetchTwitchToken.js'

export default async function fetchTwitchUsers({ ids = [], usernames = []}, isTokenExpired = false) {
  try {
    if (1 > ids.length && 1 > usernames.length) return []

    const uri =
      0 < ids.length
        ? `https://api.twitch.tv/helix/users?id=${ids.join('&id=')}`
        : `https://api.twitch.tv/helix/users?login=${usernames.join('&login=')}`

    const init = {
      headers: {
        'Client-Id': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${await fetchTwitchToken(isTokenExpired)}`
      }
    }

    const res = await fetch(uri, init)

    if (401 === res.status && !isTokenExpired)
      return fetchTwitchUsers({ids, usernames}, true)

    const data = await res.json()

    return data.data || []

  } catch (err) {
    console.error(err)
    return []
  }
}