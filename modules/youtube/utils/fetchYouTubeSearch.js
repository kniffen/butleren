import fetch from  'node-fetch'

import { logger } from '../../../logger/logger.js'

export default async function fetchYouTubeSearch({query, type = 'channel', limit = 10}) {
  try {
    const uri = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=${type}&maxResults=${limit}&key=${process.env.GOOGLE_API_KEY}`
    const init = {
      headers: {
        'Accept': 'application/json'
      }
    }

    logger.info('Youtube API: /search request', {uri});
    const res  = await fetch(uri, init)
    logger.info('Youtube API: /search response', {status: res.status});
    const data = await res.json()
    logger.debug('Youtube API: /search response body', {data});

    return data.items || []

  } catch(err) {
    logger.error('Youtube API: /search', err)
    console.error(err)
    return[]
  }
}