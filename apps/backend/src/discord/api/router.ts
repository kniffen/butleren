import { Router } from 'express';
import { getGuilds } from './getGuilds';
import { getGuild } from './getGuild';
import { putGuildSettings } from './putGuildSettings';

export const discordRouter = Router();

discordRouter.get('/guilds',        getGuilds);
discordRouter.get('/guilds/:guild', getGuild);
discordRouter.put('/guilds/:guild', putGuildSettings);
