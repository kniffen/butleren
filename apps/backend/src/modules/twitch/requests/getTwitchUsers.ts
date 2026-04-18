import fetch from 'node-fetch';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { TWITCH_API_BASE_URL, TWITCH_CLIENT_ID } from '../constants';
import { getTwitchAccessToken } from './getTwitchAccessToken';

export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  type: 'admin' | 'global_mod' | 'staff' | '';
  broadcaster_type: 'affiliate' | 'partner' | '';
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
}

export const getTwitchUsers = async function(args: {ids: string[]} | {logins: string[]}): Promise<TwitchUser[]> {
  const accessToken = await getTwitchAccessToken();

  const url = createRequestURL(args);
  logInfo('Twitch', 'Users request', { url });
  const response = await fetch(url, {
    method:  'GET',
    headers: {
      'Client-Id':     TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    logError('Twitch', `Failed to fetch users: ${response.status} ${response.statusText}`, { text });
    throw new Error('Failed to fetch Twitch users');
  }

  const responseBody = await response.json() as { data: TwitchUser[] };
  logDebug('Twitch', 'Users response body', { responseBody });

  return responseBody.data;
};

const createRequestURL = (args: {ids: string[]} | {logins: string[]}): string => {
  const url = new URL(`${TWITCH_API_BASE_URL}/users`);
  if ('ids' in args) {
    args.ids.forEach(id => url.searchParams.append('id', id));
  } else {
    args.logins.forEach(login => url.searchParams.append('login', login));
  }

  return url.toString();
};