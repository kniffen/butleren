import fetch from 'node-fetch';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { SPOTIFY_API_BASE_URL } from '../constants';
import { getSpotifyAccessToken } from './getSpotifyAccessToken';
import { SpotifyAPIShow } from './getSpotifyShows';

export interface SpotifyAPISearchResponseBody {
  shows: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: SpotifyAPIShow[]
  }
}

export const getSpotifySearch = async function(query: string): Promise<SpotifyAPIShow[]> {
  const accessToken = await getSpotifyAccessToken();

  const url = createRequestURL(query);
  logInfo('Spotify', 'Search request', { url });
  const response = await fetch(url, {
    method:  'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type':  'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    logError('Spotify', `Failed to fetch search results: ${response.status} ${response.statusText}`, { text });
    throw new Error('Failed to fetch Spotify search results');
  }

  const responseBody = await response.json() as SpotifyAPISearchResponseBody;
  logDebug('Spotify', 'Search response body', { responseBody });

  return responseBody.shows.items;
};

const createRequestURL = (query: string): string => {
  const url = new URL(`${SPOTIFY_API_BASE_URL}/search`);
  url.searchParams.append('offset', '0');
  url.searchParams.append('limit', '5');
  url.searchParams.append('query', query);
  url.searchParams.append('type', 'show');

  return url.toString();
};