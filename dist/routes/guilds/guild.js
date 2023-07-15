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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var database_1 = __importDefault(require("../../database"));
var router_1 = __importDefault(require("./router"));
var client_1 = __importDefault(require("../../discord/client"));
router_1["default"].get('/:guild', function (req, res) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var guild, db, guildData, channels, _d, _e, roles, err_1;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, client_1["default"].guilds
                            .fetch(req.params.guild)["catch"](function (err) { return console.error(req.method, req.originalUrl, err); })];
                case 1:
                    guild = _f.sent();
                    if (!guild)
                        return [2 /*return*/, res.sendStatus(404)];
                    return [4 /*yield*/, database_1["default"]];
                case 2:
                    db = _f.sent();
                    return [4 /*yield*/, db.get('SELECT * FROM guilds WHERE id = ?', [guild.id])];
                case 3:
                    guildData = _f.sent();
                    _e = (_d = Array).from;
                    return [4 /*yield*/, guild.channels.fetch()];
                case 4:
                    channels = _e.apply(_d, [(_f.sent()).values()]);
                    return [4 /*yield*/, guild.roles.fetch()];
                case 5:
                    roles = _f.sent();
                    guildData.name = guild.name;
                    guildData.iconURL = guild.iconURL();
                    guildData.categories = ((_a = channels.filter(function (channel) { return discord_js_1.ChannelType.GuildCategory === (channel === null || channel === void 0 ? void 0 : channel.type); })) === null || _a === void 0 ? void 0 : _a.length) || 0;
                    guildData.textChannels = ((_b = channels.filter(function (channel) { return discord_js_1.ChannelType.GuildText === (channel === null || channel === void 0 ? void 0 : channel.type); })) === null || _b === void 0 ? void 0 : _b.length) || 0;
                    guildData.voiceChannels = ((_c = channels.filter(function (channel) { return discord_js_1.ChannelType.GuildVoice === (channel === null || channel === void 0 ? void 0 : channel.type); })) === null || _c === void 0 ? void 0 : _c.length) || 0;
                    guildData.roles = roles.size;
                    res.send(guildData);
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _f.sent();
                    console.error(req.method, req.originalUrl, err_1);
                    res.sendStatus(500);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
});
router_1["default"].put('/:guild', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var guild_1, member_1, db_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    if (!client_1["default"].user)
                        return [2 /*return*/, res.sendStatus(500)];
                    return [4 /*yield*/, client_1["default"].guilds
                            .fetch(req.params.guild)["catch"](function (err) { return console.error(req.method, req.originalUrl, err); })];
                case 1:
                    guild_1 = _a.sent();
                    if (!guild_1)
                        return [2 /*return*/, res.sendStatus(404)];
                    return [4 /*yield*/, guild_1.members
                            .fetch(client_1["default"].user.id)["catch"](function (err) { return console.error(req.method, req.originalUrl, err); })];
                case 2:
                    member_1 = _a.sent();
                    if (!member_1)
                        return [2 /*return*/, res.sendStatus(404)];
                    return [4 /*yield*/, database_1["default"]];
                case 3:
                    db_1 = _a.sent();
                    return [4 /*yield*/, Promise.all(Object.keys(req.body).map(function (key) {
                            if ('nickname' === key)
                                member_1.setNickname(req.body[key] || null);
                            return db_1.run("UPDATE guilds SET ".concat(key, " = ? WHERE id = ?"), [req.body[key] || null, guild_1.id]);
                        }))];
                case 4:
                    _a.sent();
                    res.sendStatus(200);
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    console.error(req.method, req.originalUrl, err_2);
                    res.sendStatus(500);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
