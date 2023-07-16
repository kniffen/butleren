import { YouTubeActivities } from '../types';

export default async function fetchYouTubeActivities(
  {channelId, limit = 10 }:
  {channelId: string, limit?: number}
): Promise<YouTubeActivities['items']> {
  try {
    const uri = `https://youtube.googleapis.com/youtube/v3/activities?part=snippet&part=contentDetails&channelId=${channelId}&maxResults=${limit}&key=${process.env.GOOGLE_API_KEY}`;
    const init = {
      headers: {
        'Accept': 'application/json'
      }
    };

    const res  = await fetch(uri, init);
    const data = await res.json() as YouTubeActivities;

    return data.items || [];

  } catch(err) {
    console.error(err);
    return[];
  }
}