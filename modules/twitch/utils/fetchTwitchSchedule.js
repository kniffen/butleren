import fetch from 'node-fetch'

import fetchTwitchToken from './fetchTwitchToken.js'

export default async function fetchTwitchSchedule({ id }, isTokenExpired = false) {
  try {
    const uri = `https://api.twitch.tv/helix/schedule?broadcaster_id=${id}`
    const init = {
      headers: {
        'Client-Id': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${await fetchTwitchToken(isTokenExpired)}`
      }
    }

    const res = await fetch(uri, init)

    if (401 === res.status && !isTokenExpired)
      return fetchTwitchSchedule({id}, true)

    const data = await res.json()

    return data.data?.segments || []

  } catch (err) {
    console.error(err)
    return []
  }
}