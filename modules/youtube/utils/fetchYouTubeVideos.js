import fetch from  'node-fetch'

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

    const res  = await fetch(url, init)
    const data = await res.json()

    return data.items || []

  } catch(err) {
    console.error(err)
    return[]
  }
}