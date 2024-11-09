import fetch from 'node-fetch'

import fetchTwitchToken from './fetchTwitchToken.js'
import { logger } from '../../../logger/logger.js'

export default async function fetchTwitchSchedule({ id }, isTokenExpired = false) {
  try {
    const uri = `https://api.twitch.tv/helix/schedule?broadcaster_id=${id}`
    const init = {
      headers: {
        'Client-Id': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${await fetchTwitchToken(isTokenExpired)}`
      }
    }

    logger.info('Twitch API: /schedule request', {uri});
    const res = await fetch(uri, init);
    logger.info('Twitch API: /schedule response', {status: res.status});

    if (401 === res.status && !isTokenExpired)
      return fetchTwitchSchedule({id}, true)

    const data = await res.json()
    logger.debug('Twitch API: /schedule response body', {data});

    return data.data?.segments || []

  } catch (err) {
    logger.error('Twitch API: /schedule', err);
    console.error(err)
    return []
  }
}