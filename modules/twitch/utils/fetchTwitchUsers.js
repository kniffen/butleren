import fetch from 'node-fetch'

import fetchTwitchToken from './fetchTwitchToken.js'
import { logger } from '../../../logger/logger.js'

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

    logger.info('Twitch API: /users request', {uri});
    const res = await fetch(uri, init)
    logger.info('Twitch API: /users response', {status: res.status});

    if (401 === res.status && !isTokenExpired)
      return fetchTwitchUsers({ids, usernames}, true)

    const data = await res.json()
    logger.debug('Twitch API: /users response body', {data});

    return data.data || []

  } catch (err) {
    logger.error('Twitch API: /users', err);
    console.error(err)
    return []
  }
}