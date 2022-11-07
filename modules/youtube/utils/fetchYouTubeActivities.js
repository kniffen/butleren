import fetch from  'node-fetch'

export default async function fetchYouTubeActivities({ channelId, limit = 10 }) {
  try {
    const uri = `https://youtube.googleapis.com/youtube/v3/activities?part=snippet&part=contentDetails&channelId=${channelId}&maxResults=${limit}&key=${process.env.GOOGLE_API_KEY}`
    const init = {
      headers: {
        'Accept': 'application/json'
      }
    }

    const res  = await fetch(uri, init)
    const data = await res.json()

    return data.items || []

  } catch(err) {
    console.error(err)
    return[]
  }
}