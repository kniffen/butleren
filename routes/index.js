import { createProxyMiddleware } from 'http-proxy-middleware'

import router from './router.js'

import './guilds/index.js'
import './guilds/guild.js'
import './guilds/channels.js'
import './guilds/roles.js'

import './modules/index.js'
import './modules/module.js'

const port = process.env.APP_PORT || 5000

// Proxy other request in order to use the webpack dev server for the client.
if ('development' === process.env.NODE_ENV)
  router.use('*', createProxyMiddleware({ target: 'http://127.0.0.1:3000', ws: true }))

router.listen(port, () => console.log(`Router: Listening on port ${port}`))