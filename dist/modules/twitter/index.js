"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.twitterModule = void 0;
var discord_js_1 = require("discord.js");
var commands_1 = require("./commands");
var routes_1 = __importDefault(require("./routes"));
var onInterval_js_1 = __importDefault(require("./onInterval.js"));
exports.twitterModule = {
    id: 'twitter',
    name: 'Twitter',
    description: 'Twitter integration',
    allowedChannelTypes: [discord_js_1.ChannelType.GuildText],
    isLocked: false,
    commands: commands_1.commands,
    onInterval: onInterval_js_1["default"],
    router: routes_1["default"]
};
