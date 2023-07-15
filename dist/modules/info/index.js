"use strict";
exports.__esModule = true;
exports.infoModule = void 0;
var discord_js_1 = require("discord.js");
var commands_1 = require("./commands");
exports.infoModule = {
    id: 'info',
    name: 'Info',
    description: 'Adds various informative commands',
    allowedChannelTypes: [discord_js_1.ChannelType.GuildText],
    isLocked: true,
    commands: commands_1.commands
};
