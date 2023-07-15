import { fetchSpotifyToken } from './fetchSpotifyToken';
import { SpotifyShow } from '../types';

export const fetchSpotifyShows = async (
  ids: string[] = [],
  market = 'US',
  isTokenExpired = false
): Promise<SpotifyShow[]> => {
  if (!Array.isArray(ids) || 1 > ids.length) return [];

  try {
    const uri = `https://api.spotify.com/v1/shows?ids=${ids.join(',')}&market=${market}`;
    const init = {
      headers: {
        Authorization: `Bearer ${await fetchSpotifyToken(isTokenExpired)}`,
        'Content-Type': 'application/json'
      }
    };

    const res = await fetch(uri, init);

    if (401 === res.status && !isTokenExpired)
      return fetchSpotifyShows(ids, market, true);

    const data = await res.json() as { shows: SpotifyShow[]; };

    return data.shows || [];

  } catch (err) {
    console.error(err);
    return [];
  }
};