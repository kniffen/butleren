import fetch from  'node-fetch'

import { logger } from '../../../logger/logger.js'

export default async function fetchYouTubeActivities({ channelId, limit = 10 }) {
  try {
    const uri = `https://youtube.googleapis.com/youtube/v3/activities?part=snippet&part=contentDetails&channelId=${channelId}&maxResults=${limit}&key=${process.env.GOOGLE_API_KEY}`
    const init = {
      headers: {
        'Accept': 'application/json'
      }
    }

    logger.info('Youtube API: /activities request', {uri});
    const res  = await fetch(uri, init)
    logger.info('Youtube API: /activities response', {status: res.status});
    const data = await res.json()
    logger.debug('Youtube API: /activities response body', {data});

    return data.items || []

  } catch(err) {
    logger.error('Youtube API: /activities', err)
    console.error(err)
    return[]
  }
}