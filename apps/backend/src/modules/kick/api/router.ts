import { Router } from 'express';
import { getKickChannelsHandler } from './getKickChannelsHandler';
import { postKickChannelsHandler } from './postKickChannelsHandler';
import { deleteKickChannelsHandler } from './deleteKickChannelsHandler';

export const kickRouter = Router();

kickRouter.get('/:guildId/channels', getKickChannelsHandler);
kickRouter.post('/:guildId/channels', postKickChannelsHandler);
kickRouter.delete('/:guildId/channels/:broadcasterUserId', deleteKickChannelsHandler);
