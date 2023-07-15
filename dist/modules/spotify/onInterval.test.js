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
var onInterval_1 = __importDefault(require("./onInterval"));
var utils_1 = require("./utils");
jest.mock('./utils/fetchSpotifyShows', function () { return ({ __esModule: true, fetchSpotifyShows: jest.fn() }); });
jest.mock('./utils/fetchSpotifyShowEpisodes', function () { return ({ __esModule: true, fetchSpotifyShowEpisodes: jest.fn() }); });
describe('modules.spotify.onInterval()', function () {
    var _this = this;
    var db;
    var fetchSpotifyShowsMock = utils_1.fetchSpotifyShows;
    var fetchSpotifyShowEpisodesMock = utils_1.fetchSpotifyShowEpisodes;
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
    var defaultDatabaseEntries = [
        { guildId: 'guild001', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: 'role001' },
        { guildId: 'guild001', id: 'show002', latestEpisodeId: 'show002_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
        { guildId: 'guild002', id: 'show001', latestEpisodeId: 'show001_episode001', notificationChannelId: 'channel001', notificationRoleId: null },
    ];
    function resetShowsInDatabase() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.run('DELETE FROM spotifyShows')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO spotifyShows (guildId, id, latestEpisodeId, notificationChannelId, notificationRoleId) VALUES (?,?,?,?,?)', ['guild001', 'show001', null, 'channel001', 'role001'])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO spotifyShows (guildId, id, latestEpisodeId, notificationChannelId) VALUES (?,?,?,?)', ['guild001', 'show002', 'show002_episode003', 'channel001'])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO spotifyShows (guildId, id, latestEpisodeId, notificationChannelId) VALUES (?,?,?,?)', ['guild002', 'show001', 'show001_episode001', 'channel001'])];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    beforeAll(function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"]];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.migrate()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['spotify', 'guild001', true])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['spotify', 'guild002', true])];
                    case 4:
                        _a.sent();
                        fetchSpotifyShowsMock.mockImplementation(function (ids) { return __awaiter(_this, void 0, void 0, function () {
                            var shows;
                            return __generator(this, function (_a) {
                                shows = (ids === null || ids === void 0 ? void 0 : ids.map(function (id) { return ({ id: id, name: "".concat(id, "_name") }); })) || [];
                                return [2 /*return*/, shows];
                            });
                        }); });
                        fetchSpotifyShowEpisodesMock.mockImplementation(function (id) { return __awaiter(_this, void 0, void 0, function () {
                            var episodes;
                            return __generator(this, function (_a) {
                                episodes = [
                                    { id: "".concat(id, "_episode003"), external_urls: { spotify: "".concat(id, "_episode003_url") } },
                                    { id: "".concat(id, "_episode002"), external_urls: { spotify: "".concat(id, "_episode002_url") } },
                                    { id: "".concat(id, "_episode001"), external_urls: { spotify: "".concat(id, "_episode001_url") } },
                                ];
                                return [2 /*return*/, episodes];
                            });
                        }); });
                        jest.spyOn(db, 'all');
                        jest.spyOn(db, 'run');
                        return [2 /*return*/];
                }
            });
        });
    });
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, resetShowsInDatabase()];
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
    it('Should announce new show episodes', function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00')) })];
                    case 1:
                        _b.sent();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(fetchSpotifyShowsMock).toHaveBeenCalledTimes(1);
                        expect(fetchSpotifyShowsMock).toHaveBeenCalledWith(['show001', 'show002']);
                        expect(fetchSpotifyShowEpisodesMock).toHaveBeenCalledTimes(2);
                        expect(fetchSpotifyShowEpisodesMock).toHaveBeenNthCalledWith(1, 'show001');
                        expect(fetchSpotifyShowEpisodesMock).toHaveBeenNthCalledWith(2, 'show002');
                        expect(notificationChannel001.send).toHaveBeenCalledWith({
                            content: '<@&role001> A new episode from show001_name is out!\nshow001_episode003_url'
                        });
                        expect(notificationChannel002.send).toHaveBeenCalledWith({
                            content: 'A new episode from show001_name is out!\nshow001_episode003_url'
                        });
                        expect(db.run).toHaveBeenCalledTimes(2);
                        _a = expect;
                        return [4 /*yield*/, db.all('SELECT * FROM spotifyShows')];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toEqual([
                            { guildId: 'guild001', id: 'show001', latestEpisodeId: 'show001_episode003', notificationChannelId: 'channel001', notificationRoleId: 'role001' },
                            { guildId: 'guild001', id: 'show002', latestEpisodeId: 'show002_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
                            { guildId: 'guild002', id: 'show001', latestEpisodeId: 'show001_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
                        ]);
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
                            (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00')) }),
                            (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:01:00')) }),
                            (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:15:00')) }),
                            (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:30:00')) }),
                            (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:45:00')) }),
                            (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('1970-01-01T01:00:00')) }),
                            (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('1970-01-01T01:30:00')) }),
                            (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('1970-01-01T02:00:00')) }),
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
                    case 0: return [4 /*yield*/, db.run('UPDATE modules SET isEnabled = ? WHERE id = ? AND guildId = ?', [false, 'spotify', 'guild001'])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00')) })];
                    case 2:
                        _a.sent();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(fetchSpotifyShowsMock).toHaveBeenCalledTimes(1);
                        expect(fetchSpotifyShowsMock).toHaveBeenCalledWith(['show001']);
                        expect(fetchSpotifyShowEpisodesMock).toHaveBeenCalledTimes(1);
                        expect(fetchSpotifyShowEpisodesMock).toHaveBeenCalledWith('show001');
                        return [4 /*yield*/, db.run('UPDATE modules SET isEnabled = ? WHERE id = ? AND guildId = ?', [true, 'spotify', 'guild001'])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should handle the database not updating', function () {
        return __awaiter(this, void 0, void 0, function () {
            var dbRun, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        dbRun = db.run;
                        dbRun.mockRejectedValue('Database error');
                        return [4 /*yield*/, (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00')) })];
                    case 1:
                        _b.sent();
                        expect(console.error).toHaveBeenCalledWith('Database error');
                        _a = expect;
                        return [4 /*yield*/, db.all('SELECT * FROM spotifyShows')];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toEqual(defaultDatabaseEntries);
                        dbRun.mockRestore();
                        jest.spyOn(db, 'run');
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should handle a notification not being sent', function () {
        return __awaiter(this, void 0, void 0, function () {
            var notificationChannelSendMock, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        notificationChannelSendMock = notificationChannel001.send;
                        notificationChannelSendMock.mockRejectedValue('Error');
                        return [4 /*yield*/, (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00')) })];
                    case 1:
                        _b.sent();
                        expect(console.error).toHaveBeenCalledWith('Error');
                        expect(notificationChannel002.send).toHaveBeenCalled();
                        _a = expect;
                        return [4 /*yield*/, db.all('SELECT * FROM spotifyShows')];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toEqual([
                            { guildId: 'guild001', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: 'role001' },
                            { guildId: 'guild001', id: 'show002', latestEpisodeId: 'show002_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
                            { guildId: 'guild002', id: 'show001', latestEpisodeId: 'show001_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
                        ]);
                        notificationChannelSendMock.mockResolvedValue(undefined);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should handle a notification channel not existing', function () {
        return __awaiter(this, void 0, void 0, function () {
            var channelsFetchMock, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channelsFetchMock = guild001.channels.fetch;
                        channelsFetchMock.mockRejectedValue('Error');
                        return [4 /*yield*/, (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00')) })];
                    case 1:
                        _b.sent();
                        expect(console.error).toHaveBeenCalledWith('Error');
                        expect(notificationChannel002.send).toHaveBeenCalledTimes(1);
                        _a = expect;
                        return [4 /*yield*/, db.all('SELECT * FROM spotifyShows')];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toEqual([
                            { guildId: 'guild001', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: 'role001' },
                            { guildId: 'guild001', id: 'show002', latestEpisodeId: 'show002_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
                            { guildId: 'guild002', id: 'show001', latestEpisodeId: 'show001_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
                        ]);
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        channelsFetchMock.mockResolvedValue(notificationChannel001);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should handle a guild not existing', function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, onInterval_1["default"])({ guilds: [guild002], date: (new Date('1970-01-01T00:00:00')) })];
                    case 1:
                        _b.sent();
                        expect(notificationChannel001.send).not.toHaveBeenCalled();
                        expect(notificationChannel002.send).toHaveBeenCalled();
                        _a = expect;
                        return [4 /*yield*/, db.all('SELECT * FROM spotifyShows')];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toEqual([
                            { guildId: 'guild001', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: 'role001' },
                            { guildId: 'guild001', id: 'show002', latestEpisodeId: 'show002_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
                            { guildId: 'guild002', id: 'show001', latestEpisodeId: 'show001_episode003', notificationChannelId: 'channel001', notificationRoleId: null },
                        ]);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should handle there being no episodes', function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fetchSpotifyShowEpisodesMock.mockResolvedValue([]);
                        return [4 /*yield*/, (0, onInterval_1["default"])({ guilds: [guild001, guild002], date: (new Date('1970-01-01T00:00:00')) })];
                    case 1:
                        _b.sent();
                        expect(notificationChannel001.send).not.toHaveBeenCalled();
                        expect(notificationChannel002.send).not.toHaveBeenCalled();
                        _a = expect;
                        return [4 /*yield*/, db.all('SELECT * FROM spotifyShows')];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toEqual(defaultDatabaseEntries);
                        return [2 /*return*/];
                }
            });
        });
    });
});
