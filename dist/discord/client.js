"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var discord_js_1 = __importDefault(require("discord.js"));
var onError_1 = __importDefault(require("./eventHandlers/onError"));
var onReady_1 = __importDefault(require("./eventHandlers/onReady"));
var onGuildCreate_1 = __importDefault(require("./eventHandlers/onGuildCreate"));
var onInteractionCreate_1 = __importDefault(require("./eventHandlers/onInteractionCreate"));
var onMessage_1 = __importDefault(require("./eventHandlers/onMessage"));
if (!process.env.DISCORD_TOKEN)
    throw new Error('Missing Discord token');
var client = new discord_js_1["default"].Client({
    intents: [
        discord_js_1["default"].GatewayIntentBits.Guilds,
        discord_js_1["default"].GatewayIntentBits.GuildEmojisAndStickers,
        discord_js_1["default"].GatewayIntentBits.GuildMessages,
        discord_js_1["default"].GatewayIntentBits.GuildMessageReactions,
        discord_js_1["default"].GatewayIntentBits.DirectMessages,
        discord_js_1["default"].GatewayIntentBits.DirectMessageReactions,
    ],
    partials: [
        discord_js_1["default"].Partials.Channel // Required to receive DMs
    ]
});
client.on('error', function (err) { return (0, onError_1["default"])(err); });
client.on('ready', function (client) { return (0, onReady_1["default"])(client); });
client.on('guildCreate', function (guild) { return (0, onGuildCreate_1["default"])(guild); });
client.on('interactionCreate', function (interaction) { return (0, onInteractionCreate_1["default"])(interaction); });
client.on('messageCreate', function (message) { return (0, onMessage_1["default"])(message); });
exports["default"] = client;
