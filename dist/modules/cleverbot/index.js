"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.cleverbotModule = void 0;
var discord_js_1 = require("discord.js");
var cleverbot_node_1 = __importDefault(require("cleverbot-node"));
var onMessage_1 = __importDefault(require("./onMessage"));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
var cleverbot = new cleverbot_node_1["default"]();
if (!process.env.CLEVERBOT_API_KEY)
    throw new Error('Missing Cleverbot API key');
cleverbot.configure({ botapi: process.env.CLEVERBOT_API_KEY });
exports.cleverbotModule = {
    id: 'cleverbot',
    name: 'Cleverbot',
    allowedChannelTypes: [discord_js_1.ChannelType.GuildText],
    description: 'Talk to the artificial intelligence known as Cleverbot',
    isLocked: false,
    onMessage: function (message) { return (0, onMessage_1["default"])(message, cleverbot); }
};
