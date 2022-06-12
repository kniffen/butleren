import DiscordJS from 'discord.js'

import onError             from './eventHandlers/onError.js'
import onReady             from './eventHandlers/onReady.js'
import onGuildCreate       from './eventHandlers/onGuildCreate.js'
import onInteractionCreate from './eventHandlers/onInteractionCreate.js'

if (!process.env.DISCORD_TOKEN)
  throw new Error('Missing Discord token')

const client = new DiscordJS.Client({
  intents: [
    DiscordJS.Intents.FLAGS.GUILDS,
    DiscordJS.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    DiscordJS.Intents.FLAGS.GUILD_MESSAGES,
    DiscordJS.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    DiscordJS.Intents.FLAGS.DIRECT_MESSAGES,
    DiscordJS.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  ],
  partials: [
    'CHANNEL', // Required to receive DMs
  ]
})

client.on('error',             (err)         => onError(err))
client.on('ready',             (client)      => onReady(client))
client.on('guildCreate',       (guild)       => onGuildCreate(guild))
client.on('interactionCreate', (interaction) => onInteractionCreate(interaction))

export default client
