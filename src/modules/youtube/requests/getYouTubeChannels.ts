import fetch from 'node-fetch';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { GOOGLE_API_KEY, YOUTUBE_API_BASE_URL } from '../constants';

export interface YouTubeAPIChannel {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl: string;
    publishedAt: string;
    thumbnails: Record<'default' | 'medium' | 'high', { url: string; width: number; height: number }>;
    defaultLanguage: string;
    localized: { title: string; description: string };
    country: string;
  }
}

interface YouTubeAPIChannelsResponseBody {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items?: YouTubeAPIChannel[];
}

export const getYouTubeChannels = async function(ids: string[]): Promise<YouTubeAPIChannel[]> {

  const url = createRequestURL(ids);
  logInfo('YouTube', 'Channels request', { url });
  const response = await fetch(url, {
    method:  'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    logError('YouTube', `Failed to fetch channels: ${response.status} ${response.statusText}`, { text });
    throw new Error('Failed to fetch YouTube channels');
  }

  const responseBody = await response.json() as YouTubeAPIChannelsResponseBody;
  logDebug('YouTube', 'Channels response body', { responseBody });

  return responseBody.items || [];
};

const createRequestURL = (ids: string[]): string => {
  const url = new URL(`${YOUTUBE_API_BASE_URL}/channels`);
  url.searchParams.append('part', 'snippet');
  ids.forEach(id => url.searchParams.append('id', id));
  url.searchParams.append('key', GOOGLE_API_KEY);

  return url.toString();
};