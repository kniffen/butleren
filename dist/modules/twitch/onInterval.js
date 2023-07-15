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
var discord_js_1 = __importDefault(require("discord.js"));
var database_1 = __importDefault(require("../../database"));
var fetchTwitchStreams_1 = __importDefault(require("./utils/fetchTwitchStreams"));
function twitchOnInterval(_a) {
    var guilds = _a.guilds, date = _a.date;
    return __awaiter(this, void 0, void 0, function () {
        var db, enabledGuilds_1, entries, ids, streams_1, err_1;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // This ensures that the logic will only run every 5 min, on the 5 min mark
                    // For example 12:00, 12:05, 12:10 etc...
                    if (0 !== date.getMinutes() % 5)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, database_1["default"]];
                case 2:
                    db = _b.sent();
                    return [4 /*yield*/, db.all('SELECT guildId FROM modules WHERE id = ? AND isEnabled = ?', ['twitch', true])];
                case 3:
                    enabledGuilds_1 = (_b.sent())
                        .map(function (_a) {
                        var guildId = _a.guildId;
                        return guildId;
                    });
                    return [4 /*yield*/, db.all('SELECT * FROM twitchChannels')];
                case 4:
                    entries = (_b.sent())
                        .filter(function (_a) {
                        var guildId = _a.guildId;
                        return enabledGuilds_1.includes(guildId);
                    });
                    ids = entries.reduce(function (ids, entry) { return ids.includes(entry.id) ? ids : __spreadArray(__spreadArray([], ids, true), [entry.id], false); }, []);
                    return [4 /*yield*/, (0, fetchTwitchStreams_1["default"])({ ids: ids, usernames: [] })];
                case 5:
                    streams_1 = _b.sent();
                    return [4 /*yield*/, Promise.all(entries.map(function (entry) { return (function () { return __awaiter(_this, void 0, void 0, function () {
                            var stream, guild, notificationChannel, embed;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        stream = streams_1.find(function (_a) {
                                            var user_id = _a.user_id;
                                            return user_id === entry.id;
                                        });
                                        if (!stream)
                                            return [2 /*return*/];
                                        if (300000 < date.valueOf() - (new Date(stream.started_at)).valueOf())
                                            return [2 /*return*/];
                                        guild = guilds.find(function (_a) {
                                            var id = _a.id;
                                            return id === entry.guildId;
                                        });
                                        if (!guild)
                                            return [2 /*return*/];
                                        return [4 /*yield*/, guild.channels.fetch(entry.notificationChannelId)["catch"](console.error)];
                                    case 1:
                                        notificationChannel = _a.sent();
                                        if (!notificationChannel)
                                            return [2 /*return*/];
                                        embed = new discord_js_1["default"].EmbedBuilder();
                                        embed.setTitle("".concat(stream.user_name, " is streaming on Twitch"));
                                        embed.setURL("https://twitch.tv/".concat(stream.user_login));
                                        embed.setColor('#9146FF'); // Twitch purple
                                        embed.setDescription("**".concat(stream.title, "**"));
                                        embed.setImage("".concat(stream.thumbnail_url.replace('{width}', '400').replace('{height}', '225'), "?t=").concat(date.valueOf()));
                                        embed.setImage("".concat(stream.thumbnail_url.replace('{width}', '400').replace('{height}', '225'), "?t=").concat(date.valueOf()));
                                        embed.addFields({
                                            name: 'Category',
                                            value: stream.game_name || 'Unknown'
                                        });
                                        return [4 /*yield*/, notificationChannel.send({
                                                content: "".concat(entry.notificationRoleId ? "<@&".concat(entry.notificationRoleId, "> ") : '').concat(stream.user_name, " is live!"),
                                                embeds: [embed]
                                            })["catch"](console.error)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })(); }))];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _b.sent();
                    console.error(err_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = twitchOnInterval;
