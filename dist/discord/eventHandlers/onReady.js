"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var addGuildToDatabase_1 = __importDefault(require("../../database/addGuildToDatabase"));
var modules_1 = require("../../modules");
var commands = modules_1.modules.reduce(function (commands, mod) {
    return mod.commands ? __spreadArray(__spreadArray([], commands, true), mod.commands, true) : commands;
}, []);
function onReady(client) {
    return __awaiter(this, void 0, void 0, function () {
        var guilds;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (client.user && process.env.npm_package_version)
                        client.user.setActivity(process.env.npm_package_version);
                    console.log('Discord: Client is ready.');
                    return [4 /*yield*/, client.guilds.fetch()["catch"](console.error)];
                case 1:
                    guilds = _a.sent();
                    if (!guilds)
                        return [2 /*return*/];
                    guilds.forEach(function (_a) {
                        var id = _a.id;
                        return __awaiter(_this, void 0, void 0, function () {
                            var guild, guildCommands;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, client.guilds.fetch(id)["catch"](console.error)];
                                    case 1:
                                        guild = _b.sent();
                                        if (!guild)
                                            return [2 /*return*/];
                                        return [4 /*yield*/, (0, addGuildToDatabase_1["default"])(guild)];
                                    case 2:
                                        _b.sent();
                                        return [4 /*yield*/, guild.commands.fetch()["catch"](console.error)];
                                    case 3:
                                        guildCommands = _b.sent();
                                        if (!guildCommands)
                                            return [2 /*return*/];
                                        commands.forEach(function (command) {
                                            if (!command.data.toJSON)
                                                return;
                                            var guildCommand = guildCommands.find(function (guildCommand) { return command.data.name === guildCommand.name; });
                                            // In case a new locked command was added to the bot
                                            // we add it to the guild
                                            if (!guildCommand && command.isLocked) {
                                                guild.commands.create(command.data.toJSON())["catch"](console.error);
                                                // Update existing guild commands in case the command data was updated
                                            }
                                            else if (guildCommand) {
                                                guild.commands.edit(guildCommand, command.data.toJSON())["catch"](console.error);
                                            }
                                        });
                                        // In case a command was removed from the bot
                                        // we delete it from the guild
                                        guildCommands.forEach(function (guildCommand) {
                                            var command = commands.find(function (cmd) { return cmd.data.name === guildCommand.name; });
                                            if (!command)
                                                guild.commands["delete"](guildCommand)["catch"](console.error);
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports["default"] = onReady;
