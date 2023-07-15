"use strict";
exports.__esModule = true;
exports.funModule = void 0;
var discord_js_1 = require("discord.js");
var commands_1 = require("./commands");
exports.funModule = {
    id: 'fun',
    name: 'Fun',
    description: 'Adds some fun commands',
    isLocked: false,
    commands: commands_1.commands,
    allowedChannelTypes: [
        discord_js_1.ChannelType.GuildText,
        discord_js_1.ChannelType.DM
    ]
};
