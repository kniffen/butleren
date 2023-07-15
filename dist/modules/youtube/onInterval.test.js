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
var database_1 = __importDefault(require("../../database"));
var fetchYouTubeActivities_1 = __importDefault(require("./utils/fetchYouTubeActivities"));
var onInterval_js_1 = __importDefault(require("./onInterval.js"));
jest.mock('./utils/fetchYouTubeActivities.js', function () { return ({ __esModule: true, "default": jest.fn() }); });
describe('modules.youtube.onInterval()', function () {
    var _this = this;
    var db = null;
    var notificationChannel001 = { send: jest.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, undefined];
        }); }); }) };
    var notificationChannel002 = { send: jest.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, undefined];
        }); }); }) };
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
                        return [4 /*yield*/, db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['youtube', 'guild001', true])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['youtube', 'guild002', true])];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO youtubeChannels (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild001', 'youtubeChannel001', 'channel001'])];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO youtubeChannels (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild001', 'youtubeChannel002', 'channel001'])];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO youtubeChannels (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild001', 'youtubeChannel003', 'channel001'])];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO youtubeChannels (guildId, id, notificationChannelId, notificationRoleId) VALUES (?,?,?,?)', ['guild002', 'youtubeChannel001', 'channel002', 'role001'])];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO youtubeChannels (guildId, id, notificationChannelId, notificationRoleId) VALUES (?,?,?,?)', ['guild002', 'youtubeChannel002', 'channel002', 'role001'])];
                    case 9:
                        _a.sent();
                        jest.spyOn(db, 'all');
                        jest.spyOn(db, 'run');
                        fetchYouTubeActivities_1["default"].mockImplementation(function (_a) {
                            var channelId = _a.channelId;
                            return __awaiter(this, void 0, void 0, function () {
                                var createFakeActivity;
                                return __generator(this, function (_b) {
                                    createFakeActivity = function (channelId, channelTitle, publishedAt, videoId) { return ({
                                        snippet: {
                                            channelId: channelId,
                                            publishedAt: publishedAt,
                                            channelTitle: channelTitle
                                        },
                                        contentDetails: {
                                            upload: {
                                                videoId: videoId
                                            }
                                        }
                                    }); };
                                    switch (channelId) {
                                        case 'youtubeChannel001':
                                            return [2 /*return*/, [
                                                    createFakeActivity(channelId, "".concat(channelId, "__title"), '2000-01-01T11:01:00Z', 'video101'),
                                                    createFakeActivity(channelId, "".concat(channelId, "__title"), '2000-01-01T10:45:00Z', 'video102'),
                                                    createFakeActivity(channelId, "".concat(channelId, "__title"), '2000-01-01T10:30:00Z', 'video103')
                                                ]];
                                        case 'youtubeChannel002':
                                            return [2 /*return*/, [
                                                    createFakeActivity(channelId, "".concat(channelId, "__title"), '2000-01-01T11:05:00Z', 'video201'),
                                                    createFakeActivity(channelId, "".concat(channelId, "__title"), '2000-01-01T11:45:00Z', 'video202'),
                                                    createFakeActivity(channelId, "".concat(channelId, "__title"), '2000-01-01T10:00:00Z', 'video203')
                                                ]];
                                        case 'youtubeChannel003':
                                            return [2 /*return*/, [
                                                    createFakeActivity(channelId, null, '2000-01-01T11:01:00Z', 'video301'),
                                                    createFakeActivity(channelId, null, '2000-01-01T10:10:00Z', 'video302'),
                                                    createFakeActivity(channelId, null, '2000-01-01T10:15:00Z', 'video303')
                                                ]];
                                        default:
                                            return [2 /*return*/, []];
                                    }
                                    return [2 /*return*/];
                                });
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    beforeEach(function () {
        jest.clearAllMocks();
    });
    afterAll(function () {
        jest.restoreAllMocks();
    });
    it('Should announce new activities', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, onInterval_js_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T12:00:00Z')) })];
                    case 1:
                        _a.sent();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(fetchYouTubeActivities_1["default"]).toHaveBeenCalledTimes(3);
                        expect(fetchYouTubeActivities_1["default"]).toHaveBeenNthCalledWith(1, { channelId: 'youtubeChannel001', limit: 3 });
                        expect(fetchYouTubeActivities_1["default"]).toHaveBeenNthCalledWith(2, { channelId: 'youtubeChannel002', limit: 3 });
                        expect(fetchYouTubeActivities_1["default"]).toHaveBeenNthCalledWith(3, { channelId: 'youtubeChannel003', limit: 3 });
                        expect(notificationChannel001.send).toHaveBeenCalledTimes(3);
                        expect(notificationChannel001.send).toHaveBeenNthCalledWith(1, {
                            content: 'youtubeChannel001__title just posted a new YouTube video\nhttps://www.youtube.com/watch?v=video101'
                        });
                        expect(notificationChannel001.send).toHaveBeenNthCalledWith(2, {
                            content: 'New YouTube videos were just posted\n'
                                + 'https://www.youtube.com/watch?v=video201\n'
                                + 'https://www.youtube.com/watch?v=video202'
                        });
                        expect(notificationChannel001.send).toHaveBeenNthCalledWith(3, {
                            content: 'A new YouTube video was just posted\nhttps://www.youtube.com/watch?v=video301'
                        });
                        expect(notificationChannel002.send).toHaveBeenCalledTimes(2);
                        expect(notificationChannel002.send).toHaveBeenNthCalledWith(1, {
                            content: '<@&role001> youtubeChannel001__title just posted a new YouTube video\nhttps://www.youtube.com/watch?v=video101'
                        });
                        expect(notificationChannel002.send).toHaveBeenNthCalledWith(2, {
                            content: '<@&role001> New YouTube videos were just posted\n'
                                + 'https://www.youtube.com/watch?v=video201\n'
                                + 'https://www.youtube.com/watch?v=video202'
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should only run once an hour, on the hour', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            (0, onInterval_js_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:00:00')) }),
                            (0, onInterval_js_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:01:00')) }),
                            (0, onInterval_js_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:15:00')) }),
                            (0, onInterval_js_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:30:00')) }),
                            (0, onInterval_js_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T00:45:00')) }),
                            (0, onInterval_js_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T01:00:00')) }),
                            (0, onInterval_js_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T01:30:00')) }),
                            (0, onInterval_js_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T02:00:00')) }),
                        ])];
                    case 1:
                        _a.sent();
                        expect(db.all).toHaveBeenCalledTimes(6);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should not run for modules that have the module disabled', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.run('UPDATE modules SET isEnabled = ? WHERE id = ? AND guildId = ?', [false, 'youtube', 'guild001'])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, onInterval_js_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T12:00:00Z')) })];
                    case 2:
                        _a.sent();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(fetchYouTubeActivities_1["default"]).toHaveBeenCalledTimes(2);
                        expect(fetchYouTubeActivities_1["default"]).toHaveBeenNthCalledWith(1, { channelId: 'youtubeChannel001', limit: 3 });
                        expect(fetchYouTubeActivities_1["default"]).toHaveBeenNthCalledWith(2, { channelId: 'youtubeChannel002', limit: 3 });
                        expect(notificationChannel001.send).not.toHaveBeenCalled();
                        expect(notificationChannel002.send).toHaveBeenCalled();
                        return [4 /*yield*/, db.run('UPDATE modules SET isEnabled = ? WHERE id = ? AND guildId = ?', [true, 'youtube', 'guild001'])];
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
                        return [4 /*yield*/, (0, onInterval_js_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T12:00:00Z')) })];
                    case 1:
                        _a.sent();
                        expect(console.error).toHaveBeenCalledWith('Error');
                        expect(notificationChannel002.send).toHaveBeenCalled();
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
                        guild001.channels.fetch.mockRejectedValue('Error');
                        return [4 /*yield*/, (0, onInterval_js_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T12:00:00Z')) })];
                    case 1:
                        _a.sent();
                        expect(console.error).toHaveBeenCalledWith('Error');
                        expect(notificationChannel001.send).not.toHaveBeenCalled();
                        expect(notificationChannel002.send).toHaveBeenCalled();
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
                    case 0: return [4 /*yield*/, (0, onInterval_js_1["default"])({ guilds: [guild002], date: (new Date('2000-01-01T12:00:00Z')) })];
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
    it('should handle there being no activities', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchYouTubeActivities_1["default"].mockResolvedValue([]);
                        return [4 /*yield*/, (0, onInterval_js_1["default"])({ guilds: [guild001, guild002], date: (new Date('2000-01-01T12:00:00Z')) })];
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
