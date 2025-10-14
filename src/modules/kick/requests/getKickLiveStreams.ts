import fetch from 'node-fetch';
import { getKickToken } from './getKickToken';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { KICK_API_URLS } from '../constants';

export interface KickAPILiveStream {
  broadcaster_user_id: number;
  category: {
    id: string;
    name: string;
    thumbnail: string;
  };
  channel_id: number;
  has_mature_content: boolean;
  language: string;
  slug: string;
  started_at: string;
  stream_title: string;
  thumbnail: string;
  viewer_count: number;
}

export interface KickAPILiveStreamsResponseBody {
  data: KickAPILiveStream[];
  message: string;
}

export const getKickLiveStreams = async (broadcasterUserIds: number[]): Promise<KickAPILiveStream[] | null> => {
  try {
    const kickToken = await getKickToken();
    if (!kickToken) {
      return null;
    }

    const url = createRequestURL(broadcasterUserIds);

    logInfo('Kick', 'Live streams request', { url });
    const response = await fetch(url, {
      method:  'GET',
      headers: {
        'Authorization': `Bearer ${kickToken.access_token}`,
        'Content-Type':  'application/json',
      },
    });

    logInfo('Kick', 'Live streams response', { status: response.status });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to get live streams: ${text}`);
    }

    const responseBody = await response.json() as KickAPILiveStreamsResponseBody;
    logDebug('Kick', 'Live streams response body', { responseBody });

    return responseBody.data;

  } catch (err) {
    logError('Kick', 'Live streams', err);
    return null;
  }
};

const createRequestURL = (broadcasterUserIds: number[]): string => {
  const url = new URL(KICK_API_URLS.LIVE_STREAMS);

  broadcasterUserIds.forEach(id => {
    url.searchParams.append('broadcaster_user_id', id.toString());
  });

  logDebug('Kick', 'Created live streams request URL', { url: url.toString() });
  return url.toString();
};