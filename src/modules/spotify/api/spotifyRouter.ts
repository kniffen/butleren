import { Router } from 'express';
import { getSpotifyShowsHandler } from './getSpotifyShowsHandler';
import { postSpotifyShowsHandler } from './postSpotifyShowsHandler';
import { deleteSpotifyShowsHandler } from './deleteSpotifyShowsHandler';

export const spotifyRouter = Router();

spotifyRouter.get('/:guildId/shows', getSpotifyShowsHandler);
spotifyRouter.post('/:guildId/shows', postSpotifyShowsHandler);
spotifyRouter.delete('/:guildId/shows/:showId', deleteSpotifyShowsHandler);

