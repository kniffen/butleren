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
var fetchTwitterUsers_js_1 = __importDefault(require("./utils/fetchTwitterUsers.js"));
var fetchTwitterUserTweets_js_1 = __importDefault(require("./utils/fetchTwitterUserTweets.js"));
var onInterval_js_1 = __importDefault(require("./onInterval.js"));
jest.mock('./utils/fetchTwitterUsers.js', function () { return ({ __esModule: true, "default": jest.fn() }); });
jest.mock('./utils/fetchTwitterUserTweets.js', function () { return ({ __esModule: true, "default": jest.fn() }); });
describe('modules.twitter.onInterval()', function () {
    var db = null;
    var notificationChannel = { send: jest.fn() };
    var guild = {
        id: 'guild001',
        channels: {
            fetch: jest.fn()
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
                        jest.spyOn(db, 'all');
                        jest.spyOn(db, 'run');
                        return [2 /*return*/];
                }
            });
        });
    });
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.run('DELETE FROM modules')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, db.run('DELETE FROM twitterUsers')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['twitter', 'guild001', true])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO twitterUsers (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild001', 'twitterUser001', 'channel001'])];
                    case 4:
                        _a.sent();
                        fetchTwitterUsers_js_1["default"].mockImplementation(function (_a) {
                            var ids = _a.ids;
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2 /*return*/, ids.map(function (id) { return ({ id: id, name: "".concat(id, "_name"), username: "".concat(id, "_username") }); })];
                            }); });
                        });
                        fetchTwitterUserTweets_js_1["default"].mockResolvedValue([
                            { id: 'tweet001', created_at: '1970-01-01T00:45:00Z' },
                            { id: 'tweet002', created_at: '1970-01-01T00:15:00Z' },
                        ]);
                        guild.channels.fetch.mockResolvedValue(notificationChannel);
                        notificationChannel.send.mockResolvedValue();
                        jest.clearAllMocks();
                        return [2 /*return*/];
                }
            });
        });
    });
    afterAll(function () {
        jest.restoreAllMocks();
    });
    it('Should announce a new tweet', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.run('INSERT INTO twitterUsers (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild001', 'twitterUser002', 'channel001'])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T01:00:00Z')) })];
                    case 2:
                        _a.sent();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(fetchTwitterUsers_js_1["default"]).toHaveBeenCalledWith({ ids: ['twitterUser001', 'twitterUser002'] });
                        expect(fetchTwitterUserTweets_js_1["default"]).toHaveBeenCalledTimes(2);
                        expect(fetchTwitterUserTweets_js_1["default"]).toHaveBeenCalledWith('twitterUser001');
                        expect(fetchTwitterUserTweets_js_1["default"]).toHaveBeenCalledWith('twitterUser002');
                        expect(notificationChannel.send).toHaveBeenCalledTimes(2);
                        expect(notificationChannel.send).toHaveBeenCalledWith({
                            content: 'twitterUser001_name just tweeted\nhttps://twitter.com/twitterUser001_username/status/tweet001'
                        });
                        expect(notificationChannel.send).toHaveBeenCalledWith({
                            content: 'twitterUser002_name just tweeted\nhttps://twitter.com/twitterUser002_username/status/tweet001'
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should announce a new tweets from multiple handles', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T01:00:00Z')) })];
                    case 1:
                        _a.sent();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(fetchTwitterUsers_js_1["default"]).toHaveBeenCalledWith({ ids: ['twitterUser001'] });
                        expect(fetchTwitterUserTweets_js_1["default"]).toHaveBeenCalledWith('twitterUser001');
                        expect(notificationChannel.send).toHaveBeenCalledWith({
                            content: 'twitterUser001_name just tweeted\nhttps://twitter.com/twitterUser001_username/status/tweet001'
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should @mention a notification role', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.run('UPDATE twitterUsers SET notificationRoleId = ? WHERE id = ?', ['role001', 'twitterUser001'])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T01:00:00Z')) })];
                    case 2:
                        _a.sent();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(fetchTwitterUsers_js_1["default"]).toHaveBeenCalledWith({ ids: ['twitterUser001'] });
                        expect(fetchTwitterUserTweets_js_1["default"]).toHaveBeenCalledWith('twitterUser001');
                        expect(notificationChannel.send).toHaveBeenCalledWith({
                            content: '<@&role001> twitterUser001_name just tweeted\nhttps://twitter.com/twitterUser001_username/status/tweet001'
                        });
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
                        notificationChannel.send.mockRejectedValue('Error');
                        return [4 /*yield*/, (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T01:00:00Z')) })];
                    case 1:
                        _a.sent();
                        expect(console.error).toHaveBeenCalledWith('Error');
                        expect(fetchTwitterUsers_js_1["default"]).toHaveBeenCalledWith({ ids: ['twitterUser001'] });
                        expect(fetchTwitterUserTweets_js_1["default"]).toHaveBeenCalledWith('twitterUser001');
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should only run every half hour, on the half hour or hour mark', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T00:00:00Z')) }),
                            (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T00:30:00Z')) }),
                            (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T01:00:00Z')) }),
                            (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T01:30:00Z')) }),
                            (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T02:00:00Z')) }),
                        ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Promise.all([
                                (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T00:01:00Z')) }),
                                (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T00:15:00Z')) }),
                                (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T00:45:00Z')) }),
                            ])];
                    case 2:
                        _a.sent();
                        expect(db.all).toHaveBeenCalledTimes(10);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should not run for guilds that have the module disabled', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.run('UPDATE modules SET isEnabled = ? WHERE id = ? AND guildId = ?', [false, 'twitter', 'guild001'])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T01:00:00Z')) })];
                    case 2:
                        _a.sent();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(fetchTwitterUsers_js_1["default"]).not.toHaveBeenCalled();
                        expect(fetchTwitterUserTweets_js_1["default"]).not.toHaveBeenCalled();
                        expect(notificationChannel.send).not.toHaveBeenCalled();
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
                        guild.channels.fetch.mockRejectedValue('Error');
                        return [4 /*yield*/, (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T01:00:00Z')) })];
                    case 1:
                        _a.sent();
                        expect(console.error).toHaveBeenCalledWith('Error');
                        expect(fetchTwitterUsers_js_1["default"]).toHaveBeenCalled();
                        expect(fetchTwitterUserTweets_js_1["default"]).toHaveBeenCalled();
                        expect(notificationChannel.send).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should handle a guild not existing', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.run('UPDATE twitterUsers SET guildId = ? WHERE id = ?', ['guild999', 'twitterUser001'])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T01:00:00Z')) })];
                    case 2:
                        _a.sent();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(fetchTwitterUsers_js_1["default"]).not.toHaveBeenCalled();
                        expect(fetchTwitterUserTweets_js_1["default"]).not.toHaveBeenCalled();
                        expect(notificationChannel.send).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should handle there being no tweets', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchTwitterUserTweets_js_1["default"].mockResolvedValue([]);
                        return [4 /*yield*/, (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T01:00:00Z')) })];
                    case 1:
                        _a.sent();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(fetchTwitterUsers_js_1["default"]).toHaveBeenCalledWith({ ids: ['twitterUser001'] });
                        expect(fetchTwitterUserTweets_js_1["default"]).toHaveBeenCalledWith('twitterUser001');
                        expect(notificationChannel.send).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should handle a twitter user not existing', function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.run('INSERT INTO twitterUsers (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild001', 'twitterUser002', 'channel001'])];
                    case 1:
                        _a.sent();
                        fetchTwitterUsers_js_1["default"].mockImplementation(function (_a) {
                            var ids = _a.ids;
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2 /*return*/, ids.filter(function (id) { return 'twitterUser002' !== id; }).map(function (id) { return ({ id: id, name: "".concat(id, "_name"), username: "".concat(id, "_username") }); })];
                            }); });
                        });
                        return [4 /*yield*/, (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T01:00:00Z')) })];
                    case 2:
                        _a.sent();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(fetchTwitterUsers_js_1["default"]).toHaveBeenCalledWith({ ids: ['twitterUser001', 'twitterUser002'] });
                        expect(fetchTwitterUserTweets_js_1["default"]).toHaveBeenCalledTimes(1);
                        expect(fetchTwitterUserTweets_js_1["default"]).toHaveBeenCalledWith('twitterUser001');
                        expect(notificationChannel.send).toHaveBeenCalledTimes(1);
                        expect(notificationChannel.send).toHaveBeenCalledWith({
                            content: 'twitterUser001_name just tweeted\nhttps://twitter.com/twitterUser001_username/status/tweet001'
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    describe('multiple tweets', function () {
        beforeEach(function () {
            fetchTwitterUserTweets_js_1["default"].mockResolvedValue([
                { id: 'tweet001', created_at: '1970-01-01T00:55:00Z' },
                { id: 'tweet002', created_at: '1970-01-01T00:45:00Z' },
                { id: 'tweet003', created_at: '1970-01-01T00:15:00Z' },
            ]);
        });
        it('should group multiple tweets', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T01:00:00Z')) })];
                        case 1:
                            _a.sent();
                            expect(console.error).not.toHaveBeenCalled();
                            expect(fetchTwitterUsers_js_1["default"]).toHaveBeenCalledWith({ ids: ['twitterUser001'] });
                            expect(fetchTwitterUserTweets_js_1["default"]).toHaveBeenCalledTimes(1);
                            expect(fetchTwitterUserTweets_js_1["default"]).toHaveBeenCalledWith('twitterUser001');
                            expect(notificationChannel.send).toHaveBeenCalledTimes(1);
                            expect(notificationChannel.send).toHaveBeenCalledWith({
                                content: 'twitterUser001_name just posted some tweets\n'
                                    + 'https://twitter.com/twitterUser001_username/status/tweet001\n'
                                    + 'https://twitter.com/twitterUser001_username/status/tweet002'
                            });
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should @mention a notification role', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, db.run('UPDATE twitterUsers SET notificationRoleId = ? WHERE id = ?', ['role001', 'twitterUser001'])];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, onInterval_js_1["default"])({ guilds: [guild], date: (new Date('1970-01-01T01:00:00Z')) })];
                        case 2:
                            _a.sent();
                            expect(console.error).not.toHaveBeenCalled();
                            expect(fetchTwitterUsers_js_1["default"]).toHaveBeenCalledWith({ ids: ['twitterUser001'] });
                            expect(fetchTwitterUserTweets_js_1["default"]).toHaveBeenCalledTimes(1);
                            expect(fetchTwitterUserTweets_js_1["default"]).toHaveBeenCalledWith('twitterUser001');
                            expect(notificationChannel.send).toHaveBeenCalledTimes(1);
                            expect(notificationChannel.send).toHaveBeenCalledWith({
                                content: '<@&role001> twitterUser001_name just posted some tweets\n'
                                    + 'https://twitter.com/twitterUser001_username/status/tweet001\n'
                                    + 'https://twitter.com/twitterUser001_username/status/tweet002'
                            });
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
