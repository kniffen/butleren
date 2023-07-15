"use strict";
exports.__esModule = true;
exports.usersModule = void 0;
var discord_js_1 = require("discord.js");
var commands_1 = require("./commands");
exports.usersModule = {
    id: 'users',
    name: 'Users',
    description: 'Adds user related features',
    allowedChannelTypes: [discord_js_1.ChannelType.GuildText],
    isLocked: true,
    commands: commands_1.commands
};
