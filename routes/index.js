import router from './router.js'

import './guilds/index.js'
import './guilds/guild.js'
import './guilds/channels.js'
import './guilds/roles.js'

const port = process.env.APP_PORT || 5000

router.listen(port, () => console.log(`Router: Listening on port ${port}`))