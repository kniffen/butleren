import { YouTubeSearchResults } from '../types';

interface YouTubeSearchArgs {
  query: string,
  type?: string,
  limit?: number
}

export default async function fetchYouTubeSearch({
  query,
  type = 'channel',
  limit = 10
}: YouTubeSearchArgs): Promise<YouTubeSearchResults['items']> {
  try {
    const uri = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=${type}&maxResults=${limit}&key=${process.env.GOOGLE_API_KEY}`;
    const init = {
      headers: {
        'Accept': 'application/json'
      }
    };

    const res  = await fetch(uri, init);
    const data = await res.json() as YouTubeSearchResults;

    return data.items || [];

  } catch(err) {
    console.error(err);
    return[];
  }
}