import fetch from 'node-fetch';
import { getKickToken } from './getKickToken';
import { logDebug, logError, logInfo } from '../../../modules/logs/logger';
import { KICK_API_URLS } from '../constants';

export interface KickAPIChannel {
  broadcaster_user_id: number;
  slug: string;
  channel_description: string;
  stream_title: string;
  banner_picture: string;
  category: {
    id: string;
    name: string;
    thumbnail: string;
  };
  stream: {
    url: string;
    is_live: boolean;
    is_mature: boolean;
    language: string;
    start_time: string;
    viewer_count: number;
    thumbnail: string;
  };
}

export interface KickChannelsResponseBody {
  data: KickAPIChannel[];
  message: string;
}

export const getKickChannels = async (input: {slugs: string[]} | {broadcasterUserIds: number[]}): Promise<KickAPIChannel[] | null> => {
  try {
    const kickToken = await getKickToken();
    if (!kickToken) {
      return null;
    }

    const url = createRequestURL(input);

    logInfo('Kick', 'Channels request', { url });
    const response = await fetch(url, {
      method:  'GET',
      headers: {
        'Authorization': `Bearer ${kickToken.access_token}`,
        'Content-Type':  'application/json',
      },
    });

    logInfo('Kick', 'Channels response', { status: response.status });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to get channels: ${text}`);
    }

    const responseBody = await response.json() as KickChannelsResponseBody;
    logDebug('Kick', 'Channels response body', { responseBody });

    return responseBody.data;

  } catch (err) {
    logError('Kick', 'Channels', err);
    return null;
  }
};

const createRequestURL = (input: {slugs: string[]} | {broadcasterUserIds: number[]}): string => {
  const url = new URL(KICK_API_URLS.CHANNELS);

  if ('slugs' in input) {
    input.slugs.forEach(slug => {
      url.searchParams.append('slug', slug);
    });
  } else if ('broadcasterUserIds' in input) {
    input.broadcasterUserIds.forEach(id => {
      url.searchParams.append('broadcaster_user_id', id.toString());
    });
  }

  logDebug('Kick', 'Created channel request URL', { input, url: url.toString() });
  return url.toString();
};