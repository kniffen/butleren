import DiscordJS from 'discord.js';

import onError             from './eventHandlers/onError';
import onReady             from './eventHandlers/onReady';
import onGuildCreate       from './eventHandlers/onGuildCreate';
import onInteractionCreate from './eventHandlers/onInteractionCreate';
import onMessage           from './eventHandlers/onMessage';

if (!process.env.DISCORD_TOKEN)
  throw new Error('Missing Discord token');

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
});

client.on('error',             (err)         => onError(err));
client.on('ready',             (client)      => onReady(client));
client.on('guildCreate',       (guild)       => onGuildCreate(guild));
client.on('interactionCreate', (interaction) => onInteractionCreate(interaction));
client.on('messageCreate',     (message)     => onMessage(message));

export default client;
