import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { onError } from './eventHandlers/onError';
import { onReady } from './eventHandlers/onReady';
import { onGuildCreate } from './eventHandlers/onGuildCreate';
import { onInteractionCreate } from './eventHandlers/onInteractionCreate';

if (!process.env.DISCORD_TOKEN) {
  throw new Error('Discord token is missing in environment variables');
}

export const discordClient = new Client({
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

discordClient.on('error',             onError);
discordClient.on('ready',             onReady);
discordClient.on('guildCreate',       onGuildCreate);
discordClient.on('interactionCreate', onInteractionCreate);
