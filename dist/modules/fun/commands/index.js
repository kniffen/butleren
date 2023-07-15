"use strict";
exports.__esModule = true;
exports.xkcdCommand = exports.throwCommand = exports.dogCommand = exports.dadjokeCommand = exports.catCommand = exports.commands = void 0;
var cat_1 = require("./cat");
exports.catCommand = cat_1.catCommand;
var dadjoke_1 = require("./dadjoke");
exports.dadjokeCommand = dadjoke_1.dadjokeCommand;
var dog_1 = require("./dog");
exports.dogCommand = dog_1.dogCommand;
var throw_1 = require("./throw");
exports.throwCommand = throw_1.throwCommand;
var xkcd_1 = require("./xkcd");
exports.xkcdCommand = xkcd_1.xkcdCommand;
exports.commands = [
    cat_1.catCommand,
    dadjoke_1.dadjokeCommand,
    dog_1.dogCommand,
    throw_1.throwCommand,
    xkcd_1.xkcdCommand,
];
