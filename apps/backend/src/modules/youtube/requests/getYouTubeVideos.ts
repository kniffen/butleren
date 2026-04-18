import fetch from 'node-fetch';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { GOOGLE_API_KEY, YOUTUBE_API_BASE_URL } from '../constants';

export interface YouTubeAPIVideo {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Record<'default' | 'medium' | 'high' | 'standard' | 'maxres', { url: string; width: number; height: number }>;
    channelTitle: string;
    tags?: string[];
    categoryId: string;
    liveBroadcastContent: 'none' | 'upcoming' | 'live';
    defaultLanguage: string;
    localized: { title: string; description: string };
    defaultAudioLanguage: string;
  };
  liveStreamingDetails: {
    actualStartTime: string;
    actualEndTime: string;
    scheduledStartTime: string;
    scheduledEndTime: string;
    concurrentViewers: string;
    activeLiveChatId: string;
  }
}

interface YouTubeAPIVideosResponseBody {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items?: YouTubeAPIVideo[];
}

export const getYouTubeVideos = async function(videoIds: string[]): Promise<YouTubeAPIVideo[]> {
  const url = createRequestURL(videoIds);
  logInfo('YouTube', 'Videos request', { url });
  const response = await fetch(url, {
    method:  'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    logError('YouTube', `Failed to fetch videos: ${response.status} ${response.statusText}`, { text });
    throw new Error('Failed to fetch YouTube videos');
  }

  const responseBody = await response.json() as YouTubeAPIVideosResponseBody;
  logDebug('YouTube', 'Videos response body', { responseBody });

  return responseBody.items || [];
};

const createRequestURL = (ids: string[]): string => {
  const url = new URL(`${YOUTUBE_API_BASE_URL}/videos`);
  url.searchParams.append('part', 'snippet');
  url.searchParams.append('part', 'liveStreamingDetails');
  ids.forEach(id => url.searchParams.append('id', id));
  url.searchParams.append('key', GOOGLE_API_KEY);

  return url.toString();
};