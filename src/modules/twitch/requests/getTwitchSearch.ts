import fetch from 'node-fetch';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { TWITCH_API_BASE_URL, TWITCH_CLIENT_ID } from '../constants';
import { getTwitchAccessToken } from './getTwitchAccessToken';

export interface TwitchAPISearchResult {
  id: string;
  broadcaster_login: string;
  display_name: string;
  broadcaster_language: string;
  game_id: string;
  game_name: string;
  is_live: boolean;
  thumbnail_url: string;
  title: string;
  started_at: string;
  tag_ids: string[];
  tags: string[];
}

export const getTwitchSearch = async function(query: string): Promise<TwitchAPISearchResult[]> {
  const accessToken = await getTwitchAccessToken();

  const url = createRequestURL(query);
  logInfo('Twitch', 'Streams request', { url });
  const response = await fetch(url, {
    method:  'GET',
    headers: {
      'Client-Id':     TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    logError('Twitch', `Failed to fetch search results: ${response.status} ${response.statusText}`, { text });
    throw new Error('Failed to fetch Twitch search results');
  }

  const responseBody = await response.json() as { data: TwitchAPISearchResult[] };
  logDebug('Twitch', 'Search response body', { responseBody });

  return responseBody.data;
};

const createRequestURL = (query: string): string => {
  const url = new URL(`${TWITCH_API_BASE_URL}/search/channels`);
  url.searchParams.append('query', query);
  return url.toString();
};