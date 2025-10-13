import fetch from 'node-fetch';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { TWITCH_API_BASE_URL, TWITCH_CLIENT_ID } from '../constants';
import { getTwitchAccessToken } from './getTwitchAccessToken';

export interface TwitchSchedule {
  segments: {
    id: string;
    start_time: string;
    end_time: string;
    title: string;
    canceled_until: string | null;
    category: {
      id: string;
      name: string;
      box_art_url: string;
    } | null;
    is_recurring: boolean;
  }[];
  broadcaster_id: string;
  broadcaster_name: string;
  broadcaster_login: string;
  vacation: {
    start_time: string;
    end_time: string;
  } | null;
}

export const getTwitchSchedule = async function(broadcasterId: string): Promise<TwitchSchedule | null> {
  const accessToken = await getTwitchAccessToken();

  const url = createRequestURL(broadcasterId);
  logInfo('Twitch', 'Schedule request', { url });
  const response = await fetch(url, {
    method:  'GET',
    headers: {
      'Client-Id':     TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    logError('Twitch', `Failed to fetch schedule ${response.status} ${response.statusText}`, { text });

    if (404 === response.status) {
      return null;
    }

    throw new Error('Failed to fetch Twitch schedule');
  }

  const responseBody = await response.json() as { data: TwitchSchedule };
  logDebug('Twitch', 'Schedules response body', { responseBody });

  return responseBody.data;
};

const createRequestURL = (broadcasterId: string): string => {
  const url = new URL(`${TWITCH_API_BASE_URL}/schedule`);
  url.searchParams.append('broadcaster_id', broadcasterId);
  return url.toString();
};