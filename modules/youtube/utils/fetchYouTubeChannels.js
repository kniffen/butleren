import fetch from  'node-fetch'

export default async function fetchYouTubeChannels({ ids }) {
  try {
    const uri = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet${ids.map(id => `&id=${id}`).join('')}&key=${process.env.GOOGLE_API_KEY}`
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