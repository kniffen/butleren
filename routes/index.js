import express from 'express'
import bodyParser from 'body-parser'
import { createProxyMiddleware } from 'http-proxy-middleware'

import guildsRouter from './guilds/index.js'
import modulesRouter from './modules/index.js'
import commandsRouter from './commands/index.js'

import * as modules from '../modules/index.js'

const app = express()
const port = process.env.APP_PORT || 5000

if ('development' !== process.env.NODE_ENV)
  app.use(express.static('client/build'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/api/guilds', guildsRouter)
app.use('/api/modules', modulesRouter)
app.use('/api/commands', commandsRouter)

app.use('/api/spotify', modules.spotify.router)
app.use('/api/twitter', modules.twitter.router)
app.use('/api/twitch', modules.twitch.router)
app.use('/api/youtube', modules.youtube.router)

// Proxy other request in order to use the webpack dev server for the client.
if ('development' === process.env.NODE_ENV)
  app.use('*', createProxyMiddleware({ target: 'http://127.0.0.1:3000', ws: true }))

app.listen(port, () => console.log(`Router: Listening on port ${port}`))
