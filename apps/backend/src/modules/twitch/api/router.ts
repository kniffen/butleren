import { Router } from 'express';
import { getTwitchChannelsHandler } from './getTwitchChannelsHandler';
import { postTwitchChannelsHandler } from './postTwitchChannelsHandler';
import { deleteTwitchChannelsHandler } from './deleteTwitchChannelsHandler';

export const twitchRouter = Router();

twitchRouter.get('/:guildId/channels', getTwitchChannelsHandler);
twitchRouter.post('/:guildId/channels', postTwitchChannelsHandler);
twitchRouter.delete('/:guildId/channels/:id', deleteTwitchChannelsHandler);
