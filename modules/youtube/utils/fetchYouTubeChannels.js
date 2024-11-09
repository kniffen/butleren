import fetch from  'node-fetch'

import { logger } from '../../../logger/logger.js'

export default async function fetchYouTubeChannels({ ids }) {
  try {
    const uri = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet${ids.map(id => `&id=${id}`).join('')}&key=${process.env.GOOGLE_API_KEY}`
    const init = {
      headers: {
        'Accept': 'application/json'
      }
    }

    logger.info('Youtube API: /channels request', {uri});
    const res  = await fetch(uri, init)
    logger.info('Youtube API: /channels response', {status: res.status});
    const data = await res.json()
    logger.debug('Youtube API: /channels response body', {data});

    return data.items || []

  } catch(err) {
    logger.error('Youtube API: /channels', err)
    console.error(err)
    return[]
  }
}