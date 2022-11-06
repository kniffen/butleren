import DiscordJS from 'discord.js'

import onError             from './eventHandlers/onError.js'
import onReady             from './eventHandlers/onReady.js'
import onGuildCreate       from './eventHandlers/onGuildCreate.js'
import onInteractionCreate from './eventHandlers/onInteractionCreate.js'
import onMessage           from './eventHandlers/onMessage.js'

if (!process.env.DISCORD_TOKEN)
  throw new Error('Missing Discord token')

const client = new DiscordJS.Client({
  intents: [
    DiscordJS.GatewayIntentBits.Guilds,
    DiscordJS.GatewayIntentBits.GuildEmojisAndStickers,
    DiscordJS.GatewayIntentBits.GuildMessages,
    DiscordJS.GatewayIntentBits.GuildMessageReactions,
    DiscordJS.GatewayIntentBits.DirectMessages,
    DiscordJS.GatewayIntentBits.DirectMessageReactions,
  ],
  partials: [
    DiscordJS.Partials.Channel // Required to receive DMs
  ]
})

client.on('error',             (err)         => onError(err))
client.on('ready',             (client)      => onReady(client))
client.on('guildCreate',       (guild)       => onGuildCreate(guild))
client.on('interactionCreate', (interaction) => onInteractionCreate(interaction))
client.on('messageCreate',     (message)     => onMessage(message))

export default client
