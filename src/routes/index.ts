import express from 'express';
import bodyParser from 'body-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';

import guildsRouter from './guilds';
import modulesRouter from './modules';
import commandsRouter from './commands';

import {
  spotifyModule,
  twitterModule,
  twitchModule,
  youtubeModule
} from '../modules';

const app = express();
const port = process.env.APP_PORT || 5000;

if ('development' !== process.env.NODE_ENV)
  app.use(express.static('client/build'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api/guilds', guildsRouter);
app.use('/api/modules', modulesRouter);
app.use('/api/commands', commandsRouter);

if (spotifyModule.router) app.use('/api/spotify', spotifyModule.router);
if (twitterModule.router) app.use('/api/twitter', twitterModule.router);
if (twitchModule.router)  app.use('/api/twitch', twitchModule.router);
if (youtubeModule.router) app.use('/api/youtube', youtubeModule.router);

// Proxy other request in order to use the webpack dev server for the client.
if ('development' === process.env.NODE_ENV)
  app.use('*', createProxyMiddleware({ target: 'http://127.0.0.1:3000', ws: true }));

app.listen(port, () => console.log(`Router: Listening on port ${port}`));
