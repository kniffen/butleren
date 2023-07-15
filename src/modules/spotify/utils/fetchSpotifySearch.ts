import { fetchSpotifyToken } from './fetchSpotifyToken';
import { SpotifySearchResult } from '../types';

export const fetchSpotifySearch = async (
  query: string,
  type: string,
  market = 'US',
  limit = 5,
  isTokenExpired = false
): Promise<SpotifySearchResult> => {
  const uri = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&market=${market}&limit=${limit}`;
  const init = {
    headers: {
      Authorization: `Bearer ${await fetchSpotifyToken(isTokenExpired)}`,
      'Content-Type': 'application/json'
    }
  };

  const res = await fetch(uri, init);

  if (401 === res.status && !isTokenExpired)
    return fetchSpotifySearch(query, type, market, limit, true);

  const data = await res.json() as SpotifySearchResult;

  return data;
};