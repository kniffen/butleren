import type { NextFunction, Request, Response } from 'express';
import type { SearchResult } from '../../types';
import { logInfo } from '../../modules/logs/logger';
import { getKickChannels } from '../../modules/kick/requests/getKickChannels';
import { getSpotifySearch } from '../../modules/spotify/requests/getSpotifySearch';
import { getTwitchSearch } from '../../modules/twitch/requests/getTwitchSearch';
import { getYouTubeSearch } from '../../modules/youtube/requests/getYouTubeSearch';

export const getSearchHandler = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logInfo('Search', `Requesting search with path: ${req.path}`);
    const service = req.params['service'];
    const query = req.query['query'];
    if (!query) {
      res.sendStatus(400);
      return;
    }

    switch(service) {
      case 'kick': {
        const channels = await getKickChannels({ slugs: [query.toString()] }) || [];
        res.status(200).json(channels.map((channel) => ({
          id:       channel.broadcaster_user_id.toString(),
          name:     channel.slug,
          imageURL: channel.banner_picture,
        } satisfies SearchResult)));
        break;
      }

      case 'spotify': {
        const shows = await getSpotifySearch(query.toString());
        res.status(200).json(shows.map(show => ({
          id:       show.id,
          name:     show.name,
          imageURL: show.images[0].url,
        } satisfies SearchResult)));
        break;
      }

      case 'twitch': {
        const results = await getTwitchSearch(query.toString());
        res.status(200).json(results.map((item) => ({
          id:       item.id,
          name:     item.display_name,
          imageURL: item.thumbnail_url,
        } satisfies SearchResult)));
        break;
      }

      case 'youtube': {
        const results = await getYouTubeSearch(query.toString());
        res.status(200).json(results.map((item) => ({
          id:       item.id.channelId,
          name:     item.snippet.title,
          imageURL: item.snippet.thumbnails.medium.url
        } satisfies SearchResult)));
        break;
      }
    }

  } catch(error) {
    next(error);
  }
};