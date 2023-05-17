import fetch from 'node-fetch';

import { fetchSpotifyToken } from './fetchSpotifyToken';

export const fetchSpotifyShowEpisodes = async (
  id: string,
  market = 'US',
  isTokenExpired = false
): Promise<SpotifyShowEpisodes['items']> => {
  try {
    const init = {
      headers: {
        Authorization: `Bearer ${await fetchSpotifyToken(isTokenExpired)}`,
        'Content-Type': 'application/json'
      }
    };

    const res = await fetch(`https://api.spotify.com/v1/shows/${id}/episodes/?market=${market}`, init);

    if (401 === res.status && !isTokenExpired) return fetchSpotifyShowEpisodes(id, market, true);

    const data = await res.json() as SpotifyShowEpisodes;

    return data.items || [];

  } catch (err) {
    console.error(err);
    return [];
  }
};