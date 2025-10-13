import { Router } from 'express';
import { getYouTubeChannelsHandler } from './getYouTubeChannelsHandler';
import { postYouTubeChannelsHandler } from './postYouTubeChannelsHandler';
import { deleteYouTubeChannelsHandler } from './deleteYouTubeChannelsHandler';

export const youTubeRouter = Router();

youTubeRouter.get('/:guildId/channels', getYouTubeChannelsHandler);
youTubeRouter.post('/:guildId/channels', postYouTubeChannelsHandler);
youTubeRouter.delete('/:guildId/channels/:channelId', deleteYouTubeChannelsHandler);
