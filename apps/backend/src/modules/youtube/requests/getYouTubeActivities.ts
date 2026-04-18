import fetch from 'node-fetch';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { GOOGLE_API_KEY, YOUTUBE_API_BASE_URL } from '../constants';

export interface YouTubeAPIActivity {
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
    type: 'channelItem' | 'comment' | 'favorite' | 'like' | 'playlistItem' | 'promotedItem' | 'recommendation' | 'social' | 'subscription' | 'upload';
    groupId: string;
  };
  contentDetails: {
    upload?: {
      videoId: string;
    };
    like?: {
      resourceId: {
        kind: string,
        videoId: string,
      }
    },
    favorite?: {
      resourceId: {
        kind: string;
        videoId: string;
      };
    };
    comment?: {
      resourceId: {
        kind: string;
        videoId: string;
        channelId: string;
      };
    };
    subscription?: {
      resourceId: {
        kind: string;
        channelId: string;
      };
    };
    playlistItem?: {
      resourceId: {
        kind: string;
        videoId: string;
      };
      playlistId: string;
      playlistItemId: string;
    };
    recommendation?: {
      resourceId: {
        kind: string;
        videoId: string;
        channelId: string;
      };
      reason: 'videoFavorited' | 'videoLiked' | 'videoWatched';
      seedResourceId: {
        kind: string;
        videoId: string;
        channelId: string;
        playlistId: string;
      };
    };
    social?: {
      type: 'facebook' | 'googlePlus' | 'twitter' | 'unspecified';
      resourceId: {
        kind: string;
        videoId: string;
        channelId: string;
        playlistId: string;
      },
      author: string;
      referenceUrl: string;
      imageUrl: string;
    },
    channelItem?: {
      resourceId: unknown;
    };
  };
}

interface YouTubeAPIActivitiesResponseBody {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items?: YouTubeAPIActivity[];
}

export const getYouTubeActivities = async function(channelId: string, maxResults = 20): Promise<YouTubeAPIActivity[]> {
  const url = createRequestURL(channelId, maxResults);
  logInfo('YouTube', 'Activities request', { url });
  const response = await fetch(url, {
    method:  'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    logError('YouTube', `Failed to fetch activities: ${response.status} ${response.statusText}`, { text });
    throw new Error('Failed to fetch YouTube activities');
  }

  const responseBody = await response.json() as YouTubeAPIActivitiesResponseBody;
  logDebug('YouTube', 'Activities response body', { responseBody });

  return responseBody.items || [];
};

const createRequestURL = (channelId: string, maxResults: number): string => {
  const url = new URL(`${YOUTUBE_API_BASE_URL}/activities`);
  url.searchParams.append('part', 'snippet');
  url.searchParams.append('part', 'contentDetails');
  url.searchParams.append('channelId', channelId);
  url.searchParams.append('maxResults', maxResults.toString());
  url.searchParams.append('key', GOOGLE_API_KEY);

  return url.toString();
};