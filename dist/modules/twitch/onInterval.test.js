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
var discord_js_1 = __importDefault(require("discord.js"));
var database_1 = __importDefault(require("../../database"));
var fetchTwitchStreams_1 = __importDefault(require("./utils/fetchTwitchStreams"));
var onInterval_1 = __importDefault(require("./onInterval"));
jest.mock('./utils/fetchTwitchStreams', function () { return ({ __esModule: true, "default": jest.fn() }); });
describe('modules.twitch.onInterval()', function () {
    var _this = this;
    var fetchTwitchStreamsMock = fetchTwitchStreams_1["default"];
    var db;
    var notificationChannel001 = { send: jest.fn().mockResolvedValue(undefined) };
    var notificationChannel002 = { send: jest.fn().mockResolvedValue(undefined) };
    var guild001 = {
        id: 'guild001',
        channels: {
            fetch: jest.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, notificationChannel001];
            }); }); })
        }
    };
    var guild002 = {
        id: 'guild002',
        channels: {
            fetch: jest.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, notificationChannel002];
            }); }); })
        }
    };
    function resetTwitchChannelsInDatabase() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.run('DELETE FROM twitchChannels')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO twitchChannels (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild001', 'twitchChannel001', 'channel001'])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO twitchChannels (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild001', 'twitchChannel002', 'channel001'])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO twitchChannels (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild001', 'twitchChannel003', 'channel001'])];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO twitchChannels (guildId, id, notificationChannelId, notificationRoleId) VALUES (?,?,?,?)', ['guild002', 'twitchChannel001', 'channel001', 'role001'])];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    beforeAll(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"]];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.migrate()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['twitch', 'guild001', true])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['twitch', 'guild002', true])];
                    case 4:
                        _a.sent();
                        jest.spyOn(db, 'all');
                        jest.spyOn(db, 'run');
                        fetchTwitchStreamsMock.mockResolvedValue([
                            {
                                user_id: 'twitchChannel001',
                                user_login: 'twitchChannel001_login',
                                user_name: 'twitchChannel001_name',
                                title: 'twitchChannel001_title',
                                game_name: 'twitchChannel001_category',
                                thumbnail_url: 'https://twitchChannel001_thumbnail_{width}x{height}.ext',
                                started_at: '2000-01-01T00:58:00Z'
                            },
                            {
                                user_id: 'twitchChannel002',
                                user_login: 'twitchChannel002_login',
                                user_name: 'twitchChannel002_name',
                                title: 'twitchChannel002_title',
                                thumbnail_url: 'https://twitchChannel002_thumbnail_{width}x{height}.ext',
                                started_at: '2000-01-01T00:55:00Z'
                            },
                            {
                                user_id: 'twitchChannel003',
                                user_login: 'twitchChannel003_login',
                                user_name: 'twitchChannel003_name',
                                title: 'twitchChannel003_title',
                                thumbnail_url: 'https://twitchChannel003_thumbnail_{width}x{height}.ext',
                                started_at: '2000-01-01T00:54:00Z'
                            }
                        ]);
                        return [2 /*return*/];
                }
            });
        });
    });
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, resetTwitchChannelsInDatabase()];
                    case 1:
                        _a.sent();
                        jest.clearAllMocks();
                        return [2 /*return*/];
                }
            });
        });
    });
    afterAll(function () {
        jest.restoreAllMocks();
    });
    it('Should channels that have gone live within the last 5 minutes', function () {
        return __awaiter(this, void 0, void 0, function () {
            var expectedEmbed001, expectedEmbed002;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedEmbed001 = new discord_js_1["default"].EmbedBuilder();
                        expectedEmbed001.setTitle('twitchChannel001_name is streaming on Twitch');
                        expectedEmbed001.setURL('https://twitch.tv/twitchChannel001_login');
                        expectedEmbed001.setColor('#9146FF');
                        expectedEmbed001.setDescription('**twitchChannel001_title**');
                        expectedEmbed001.setImage('https://twitchChannel001_thumbnail_400x225.ext?t=946688400000');
                        expectedEmbed001.addFields({ name: 'Category', value: 'twitchChannel001_category' });
                        expectedEmbed002 = new discord_js_1["default"].EmbedBuilder();
                        expectedEmbed002.setTitle('twitchChannel002_name is streaming on Twitch');
                        expectedEmbed002.setURL('https://twitch.tv/twitchChannel002_login');
                        expectedEmbed002.setColor('#9146FF');
                        expectedEmbed002.setDescription('**twitchChannel002_title**');
                        expectedEmbed002.setImage('https://twitchChannel002_thumbnail_400x225.ext?t=946688400000');
                        expectedEmbed002.addFields({ name: 'Category', value: 'Unknown' });
                        return [4 /*yield*/, (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T01:00:00Z')) })];
                    case 1:
                        _a.sent();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(fetchTwitchStreamsMock).toHaveBeenCalledTimes(1);
                        expect(fetchTwitchStreamsMock).toHaveBeenCalledWith({
                            ids: ['twitchChannel001', 'twitchChannel002', 'twitchChannel003'],
                            usernames: []
                        });
                        expect(notificationChannel001.send).toHaveBeenCalledTimes(2);
                        expect(notificationChannel001.send).toHaveBeenNthCalledWith(1, {
                            content: 'twitchChannel001_name is live!',
                            embeds: [expectedEmbed001]
                        });
                        expect(notificationChannel001.send).toHaveBeenNthCalledWith(2, {
                            content: 'twitchChannel002_name is live!',
                            embeds: [expectedEmbed002]
                        });
                        expect(notificationChannel002.send).toHaveBeenCalledTimes(1);
                        expect(notificationChannel002.send).toHaveBeenCalledWith({
                            content: '<@&role001> twitchChannel001_name is live!',
                            embeds: [expectedEmbed001]
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should only run every 5 min', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:00:00Z')) }),
                            (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:01:00Z')) }),
                            (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:05:00Z')) }),
                            (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:09:00Z')) }),
                            (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:10:00Z')) }),
                            (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:30:00Z')) }),
                            (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:31:00Z')) }),
                            (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:59:00Z')) }),
                        ])];
                    case 1:
                        _a.sent();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(db.all).toHaveBeenCalledTimes(8);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should not run for modules that have the module disabled', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.run('UPDATE modules SET isEnabled = ? WHERE id = ? AND guildId = ?', [false, 'twitch', 'guild001'])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T01:00:00Z')) })];
                    case 2:
                        _a.sent();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(fetchTwitchStreamsMock).toHaveBeenCalledTimes(1);
                        expect(fetchTwitchStreamsMock).toHaveBeenCalledWith({ ids: ['twitchChannel001'], usernames: [] });
                        expect(notificationChannel001.send).not.toHaveBeenCalled();
                        expect(notificationChannel002.send).toHaveBeenCalled();
                        return [4 /*yield*/, db.run('UPDATE modules SET isEnabled = ? WHERE id = ? AND guildId = ?', [true, 'twitch', 'guild001'])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should handle a notification not being sent', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        notificationChannel001.send.mockRejectedValue('Error');
                        return [4 /*yield*/, (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T01:00:00Z')) })];
                    case 1:
                        _a.sent();
                        expect(console.error).toHaveBeenCalledWith('Error');
                        expect(notificationChannel002.send).toHaveBeenCalled();
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        notificationChannel001.send.mockResolvedValue();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should handle a notification channel not existing', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        guild001.channels.fetch.mockRejectedValue('Error');
                        return [4 /*yield*/, (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T01:00:00Z')) })];
                    case 1:
                        _a.sent();
                        expect(console.error).toHaveBeenCalledWith('Error');
                        expect(notificationChannel001.send).not.toHaveBeenCalled();
                        expect(notificationChannel002.send).toHaveBeenCalled();
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        guild001.channels.fetch.mockResolvedValue(notificationChannel001);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should handle a guild not existing', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, onInterval_1["default"])({ guilds: [guild002], date: (new Date('2000-01-01T01:00:00Z')) })];
                    case 1:
                        _a.sent();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(notificationChannel001.send).not.toHaveBeenCalled();
                        expect(notificationChannel002.send).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should handle there being no streams', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchTwitchStreamsMock.mockResolvedValue([]);
                        return [4 /*yield*/, (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T01:00:00Z')) })];
                    case 1:
                        _a.sent();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(notificationChannel001.send).not.toHaveBeenCalled();
                        expect(notificationChannel002.send).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        });
    });
});
