"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.youtubeModule = void 0;
var discord_js_1 = require("discord.js");
var onInterval_1 = __importDefault(require("./onInterval"));
var routes_1 = __importDefault(require("./routes"));
exports.youtubeModule = {
    id: 'youtube',
    name: 'YouTube',
    description: 'YouTube integration',
    allowedChannelTypes: [discord_js_1.ChannelType.GuildText],
    isLocked: false,
    onInterval: onInterval_1["default"],
    router: routes_1["default"]
};
