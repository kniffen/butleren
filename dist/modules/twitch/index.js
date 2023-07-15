"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.twitchModule = void 0;
var discord_js_1 = require("discord.js");
var commands_1 = require("./commands");
var onInterval_1 = __importDefault(require("./onInterval"));
var routes_1 = __importDefault(require("./routes"));
exports.twitchModule = {
    id: 'twitch',
    name: 'Twitch',
    description: 'Twitch.TV integration',
    allowedChannelTypes: [discord_js_1.ChannelType.GuildText],
    isLocked: false,
    commands: commands_1.commands,
    onInterval: onInterval_1["default"],
    router: routes_1["default"]
};
