import fetch from  'node-fetch'

import { logger } from '../../../logger/logger.js'

export default async function fetchYouTubeVideos({ videoIds }) {
  try {

    const url = new URL('https://youtube.googleapis.com/youtube/v3/videos')
    url.searchParams.append('part', 'snippet');
    url.searchParams.append('part', 'liveStreamingDetails');
    videoIds.forEach((videoId) => url.searchParams.append('id', videoId));
    url.searchParams.set('key', process.env.GOOGLE_API_KEY);

    const init = {
      headers: {
        'Accept': 'application/json'
      }
    }

    logger.info('Youtube API: /videos request', {url});
    const res  = await fetch(url, init)
    logger.info('Youtube API: /videos response', {status: res.status});
    const data = await res.json()
    logger.info('Youtube API: /videos response body', {data});

    return data.items || []

  } catch(err) {
    logger.error('Youtube API: /videos', err)
    console.error(err)
    return[]
  }
}