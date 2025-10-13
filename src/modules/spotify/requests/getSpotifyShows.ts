import fetch from 'node-fetch';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { SPOTIFY_API_BASE_URL } from '../constants';
import { getSpotifyAccessToken } from './getSpotifyAccessToken';

export interface SpotifyAPIShow {
  available_markets: string[];
  copyrights: {
    text: string;
    type: string;
  }[];
  description: string;
  html_description: string;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
      url: string;
      height: number;
      width: number;
  }[];
  is_externally_hosted: boolean;
  languages: string[];
  media_type: string;
  name: string;
  publisher: string;
  type: string;
  uri: string;
  total_episodes: number;
}

export interface SpotifyAPIShowsResponseBody {
  shows: SpotifyAPIShow[]
}

export const getSpotifyShows = async function(ids: string[], market = 'US'): Promise<SpotifyAPIShow[]> {
  const accessToken = await getSpotifyAccessToken();

  const url = createRequestURL(ids, market);
  logInfo('Spotify', 'Shows request', { url });
  const response = await fetch(url, {
    method:  'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type':  'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    logError('Spotify', `Failed to fetch shows: ${response.status} ${response.statusText}`, { text });
    throw new Error('Failed to fetch Spotify shows');
  }

  const responseBody = await response.json() as SpotifyAPIShowsResponseBody;
  logDebug('Spotify', 'Shows response body', { responseBody });

  return responseBody.shows;
};

const createRequestURL = (ids: string[], market: string): string => {
  const url = new URL(`${SPOTIFY_API_BASE_URL}/shows`);
  url.searchParams.append('ids', ids.join(','));
  url.searchParams.append('market', market);

  return url.toString();
};