import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { onError } from './eventHandlers/onError';
import { onReady } from './eventHandlers/onReady';
import { onGuildCreate } from './eventHandlers/onGuildCreate';
import { onInteractionCreate } from './eventHandlers/onInteractionCreate';

// eslint-disable-next-line no-undef
if (!process.env.DISCORD_TOKEN) {
  throw new Error('Discord token is missing in environment variables');
}

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildExpressions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
  ],
  partials: [
    Partials.Channel
  ]
});

client.on('error',             onError);
client.on('ready',             onReady);
client.on('guildCreate',       onGuildCreate);
client.on('interactionCreate', onInteractionCreate);

// eslint-disable-next-line no-undef
client.login(process.env.DISCORD_TOKEN);
