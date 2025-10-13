import fetch from 'node-fetch';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { GOOGLE_API_KEY, YOUTUBE_API_BASE_URL } from '../constants';

export interface YouTubeAPISearchResult {
  kind: string;
  etag: string;
  id: {
    kind: string;
    channelId: string;
    videoId?: string;
    playlistId?: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Record<'default' | 'medium' | 'high', { url: string; width: number; height: number }>;
    channelTitle: string;
    liveBroadcastContent: string;
  }
}

interface YouTubeAPISearchResponseBody {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items?: YouTubeAPISearchResult[];
}

export const getYouTubeSearch = async function(query: string): Promise<YouTubeAPISearchResult[]> {
  const url = createRequestURL(query);
  logInfo('YouTube', 'Search request', { url });
  const response = await fetch(url, {
    method:  'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    logError('YouTube', `Failed to fetch search: ${response.status} ${response.statusText}`, { text });
    throw new Error('Failed to fetch YouTube search');
  }

  const responseBody = await response.json() as YouTubeAPISearchResponseBody;
  logDebug('YouTube', 'Search response body', { responseBody });

  return responseBody.items || [];
};

const createRequestURL = (query: string): string => {
  const url = new URL(`${YOUTUBE_API_BASE_URL}/search`);
  url.searchParams.append('part', 'snippet');
  url.searchParams.append('q', query);
  url.searchParams.append('type', 'channel');
  url.searchParams.append('key', GOOGLE_API_KEY);

  return url.toString();
};