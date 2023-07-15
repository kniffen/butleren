"use strict";
exports.__esModule = true;
exports.truckersmpModule = void 0;
var discord_js_1 = require("discord.js");
var commands_1 = require("./commands");
exports.truckersmpModule = {
    id: 'truckersmp',
    name: 'TruckersMP',
    description: 'Adds TruckersMP related features',
    allowedChannelTypes: [discord_js_1.ChannelType.GuildText],
    isLocked: false,
    commands: commands_1.commands
};
