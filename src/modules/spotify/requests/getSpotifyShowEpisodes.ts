import fetch from 'node-fetch';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { SPOTIFY_API_BASE_URL } from '../constants';
import { getSpotifyAccessToken } from './getSpotifyAccessToken';

export interface SpotifyAPIShowEpisode {
  audio_preview_url: string | null;
  description: string;
  html_description: string;
  duration_ms: number;
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
  is_playable: boolean;
  languages: string[];
  name: string;
  release_date: string;
  release_date_precision: string;
  resume_point: {
    fully_played: boolean;
    resume_position_ms: number;
  };
  type: string;
  uri: string;
  restrictions?: {
    reason: string;
  };
}

export interface SpotifyAPIShowEpisodesResponseBody {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: (SpotifyAPIShowEpisode | null)[];
}

export const getSpotifyShowEpisodes = async function(showId: string, market = 'US'): Promise<SpotifyAPIShowEpisode[]> {
  const accessToken = await getSpotifyAccessToken();

  const url = createRequestURL(showId, market);
  logInfo('Spotify', 'Show episodes request', { url });
  const response = await fetch(url, {
    method:  'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type':  'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    logError('Spotify', `Failed to fetch show episodes: ${response.status} ${response.statusText}`, { text });
    throw new Error('Failed to fetch Spotify show episodes');
  }

  const responseBody = await response.json() as SpotifyAPIShowEpisodesResponseBody;
  logDebug('Spotify', 'Show episodes response body', { responseBody });

  return responseBody.items.filter((item): item is SpotifyAPIShowEpisode => null !== item);
};

const createRequestURL = (showId: string, market: string): string => {
  const url = new URL(`${SPOTIFY_API_BASE_URL}/shows/${showId}/episodes`);
  url.searchParams.append('market', market);

  return url.toString();
};