"use strict";
exports.__esModule = true;
exports.weatherModule = void 0;
var discord_js_1 = require("discord.js");
var commands_1 = require("./commands");
exports.weatherModule = {
    id: 'weather',
    name: 'Weather',
    description: 'Provides weather reports',
    allowedChannelTypes: [discord_js_1.ChannelType.GuildText],
    isLocked: false,
    commands: commands_1.commands
};
