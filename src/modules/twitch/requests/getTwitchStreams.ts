import fetch from 'node-fetch';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { TWITCH_API_BASE_URL, TWITCH_CLIENT_ID } from '../constants';
import { getTwitchAccessToken } from './getTwitchAccessToken';

export interface TwitchStream {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: 'live' | '';
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
}

export const getTwitchStreams = async function(ids: string[]): Promise<TwitchStream[]> {
  const accessToken = await getTwitchAccessToken();

  const url = createRequestURL(ids);
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
    logError('Twitch', `Failed to fetch streams: ${response.status} ${response.statusText}`, { text });
    throw new Error('Failed to fetch Twitch streams');
  }

  const responseBody = await response.json() as { data: TwitchStream[] };
  logDebug('Twitch', 'Streams response body', { responseBody });

  return responseBody.data;
};

const createRequestURL = (ids: string[]): string => {
  const url = new URL(`${TWITCH_API_BASE_URL}/streams`);
  ids.forEach(id => url.searchParams.append('user_id', id));
  return url.toString();
};