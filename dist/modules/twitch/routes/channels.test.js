"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var supertest_1 = __importDefault(require("supertest"));
var database_1 = __importDefault(require("../../../database"));
var _1 = __importDefault(require("./"));
var fetchTwitchUsers_1 = __importDefault(require("../utils/fetchTwitchUsers"));
jest.mock('../utils/fetchTwitchUsers', function () { return ({ __esModule: true, "default": jest.fn() }); });
describe('/api/twitch/:guild/channels', function () {
    var fetchTwitchUsersMock = fetchTwitchUsers_1["default"];
    var URI = '/twitch/guild001/channels';
    var app;
    var db;
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
                        return [4 /*yield*/, db.run('INSERT INTO twitchChannels (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild001', 'twitchChannel002', 'channel002'])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO twitchChannels (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild002', 'twitchChannel001', 'channel003'])];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO twitchChannels (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild002', 'twitchChannel003', 'channel004'])];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    var defaultDatabaseEntries = [
        { id: 'twitchChannel001', guildId: 'guild001', notificationChannelId: 'channel001', notificationRoleId: null },
        { id: 'twitchChannel002', guildId: 'guild001', notificationChannelId: 'channel002', notificationRoleId: null },
        { id: 'twitchChannel001', guildId: 'guild002', notificationChannelId: 'channel003', notificationRoleId: null },
        { id: 'twitchChannel003', guildId: 'guild002', notificationChannelId: 'channel004', notificationRoleId: null },
    ];
    beforeAll(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app = (0, express_1["default"])();
                        return [4 /*yield*/, database_1["default"]];
                    case 1:
                        db = _a.sent();
                        app.use(body_parser_1["default"].urlencoded({ extended: false }));
                        app.use(body_parser_1["default"].json());
                        app.use('/twitch', _1["default"]);
                        return [4 /*yield*/, db.migrate()];
                    case 2:
                        _a.sent();
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
    describe('GET', function () {
        it('Should respond with an array of entries for the guild', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fetchTwitchUsersMock.mockImplementation(function (_a) {
                                var ids = _a.ids;
                                return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_b) {
                                        return [2 /*return*/, ids.map(function (id) { return ({
                                                id: id,
                                                display_name: "".concat(id, "_display_name"),
                                                description: "".concat(id, "_description"),
                                                login: "".concat(id, "_login")
                                            }); })];
                                    });
                                });
                            });
                            return [4 /*yield*/, (0, supertest_1["default"])(app).get(URI)];
                        case 1:
                            res = _a.sent();
                            expect(console.error).not.toHaveBeenCalled();
                            expect(fetchTwitchUsersMock).toHaveBeenCalledWith({ ids: ['twitchChannel001', 'twitchChannel002'], usernames: [] });
                            expect(res.body).toEqual([
                                {
                                    id: 'twitchChannel001',
                                    name: 'twitchChannel001_display_name',
                                    description: 'twitchChannel001_description',
                                    url: 'https://www.twitch.tv/twitchChannel001_login',
                                    notificationChannelId: 'channel001',
                                    notificationRoleId: null
                                },
                                {
                                    id: 'twitchChannel002',
                                    name: 'twitchChannel002_display_name',
                                    description: 'twitchChannel002_description',
                                    url: 'https://www.twitch.tv/twitchChannel002_login',
                                    notificationChannelId: 'channel002',
                                    notificationRoleId: null
                                }
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should handle there being no twitch API results corresponding with the entries', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fetchTwitchUsersMock.mockResolvedValue([]);
                            return [4 /*yield*/, (0, supertest_1["default"])(app).get(URI)];
                        case 1:
                            res = _a.sent();
                            expect(console.error).not.toHaveBeenCalled();
                            expect(res.status).toEqual(200);
                            expect(res.body).toEqual([
                                {
                                    id: 'twitchChannel001',
                                    name: '',
                                    description: '',
                                    url: 'https://www.twitch.tv/',
                                    notificationChannelId: 'channel001',
                                    notificationRoleId: null
                                },
                                {
                                    id: 'twitchChannel002',
                                    name: '',
                                    description: '',
                                    url: 'https://www.twitch.tv/',
                                    notificationChannelId: 'channel002',
                                    notificationRoleId: null
                                }
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should respond with a 500 status code if there was an issue reading from the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var allSpy, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            allSpy = jest.spyOn(db, 'all').mockRejectedValue('Database error');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).get(URI)];
                        case 1:
                            res = _a.sent();
                            expect(console.error).toHaveBeenCalledWith('GET', '/twitch/guild001/channels', 'Database error');
                            expect(res.status).toEqual(500);
                            allSpy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('POST', function () {
        var body = {
            id: 'twitchChannel999',
            notificationChannelId: 'channel999',
            notificationRoleId: 'role999'
        };
        it('Should add an entry to the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).post(URI).send(body)];
                        case 1:
                            res = _b.sent();
                            expect(console.error).not.toHaveBeenCalled();
                            expect(res.status).toEqual(201);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM twitchChannels')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual(__spreadArray(__spreadArray([], defaultDatabaseEntries, true), [
                                { id: 'twitchChannel999', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999' },
                            ], false));
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should respond with a 500 status code if there was an issue adding the entry to the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var runSpy, res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            runSpy = jest.spyOn(db, 'run').mockRejectedValue('Database error');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).post(URI).send(body)];
                        case 1:
                            res = _b.sent();
                            expect(console.error).toHaveBeenCalledWith('POST', URI, 'Database error');
                            expect(res.status).toEqual(500);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM twitchChannels')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual(defaultDatabaseEntries);
                            runSpy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should respond with a 409 status code if entry already exists', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).post(URI).send(body)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, (0, supertest_1["default"])(app).post(URI).send(body)];
                        case 2:
                            res = _b.sent();
                            expect(console.error).not.toHaveBeenCalled();
                            expect(res.status).toEqual(409);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM twitchChannels')];
                        case 3:
                            _a.apply(void 0, [_b.sent()]).toEqual(__spreadArray(__spreadArray([], defaultDatabaseEntries, true), [
                                { id: 'twitchChannel999', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999' },
                            ], false));
                            return [2 /*return*/];
                    }
                });
            });
        });
        it.todo('Should respond with a 400 status code if there were missing body properties');
    });
    describe('PATCH', function () {
        var body = {
            id: 'twitchChannel001',
            notificationChannelId: 'channel999',
            notificationRoleId: 'role999'
        };
        it('Should update an entry in the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).patch(URI).send(body)];
                        case 1:
                            res = _b.sent();
                            expect(console.error).not.toHaveBeenCalled();
                            expect(res.status).toEqual(200);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM twitchChannels')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual([
                                { id: 'twitchChannel001', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999' },
                                defaultDatabaseEntries[1],
                                defaultDatabaseEntries[2],
                                defaultDatabaseEntries[3],
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should respond with a 500 status code if there was an issue updating the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var runSpy, res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            runSpy = jest.spyOn(db, 'run').mockRejectedValue('Database error');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).patch(URI).send(body)];
                        case 1:
                            res = _b.sent();
                            expect(console.error).toHaveBeenCalledWith('PATCH', URI, 'Database error');
                            expect(res.status).toEqual(500);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM twitchChannels')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual(defaultDatabaseEntries);
                            runSpy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should ignore unsupported properties', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).patch(URI).send(__assign(__assign({}, body), { foo: 'bar' }))];
                        case 1:
                            res = _b.sent();
                            expect(console.error).not.toHaveBeenCalled();
                            expect(res.status).toEqual(200);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM twitchChannels')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual([
                                { id: 'twitchChannel001', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999' },
                                defaultDatabaseEntries[1],
                                defaultDatabaseEntries[2],
                                defaultDatabaseEntries[3],
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should respond with a 404 status code if the entry does not exist in the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).patch(URI).send(__assign(__assign({}, body), { id: 'twitchUser999' }))];
                        case 1:
                            res = _b.sent();
                            expect(console.error).not.toHaveBeenCalled();
                            expect(res.status).toEqual(404);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM twitchChannels')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual(defaultDatabaseEntries);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('DELETE', function () {
        var body = {
            id: 'twitchChannel001'
        };
        it('Should delete an entry from the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app)["delete"](URI).send(body)];
                        case 1:
                            res = _b.sent();
                            expect(console.error).not.toHaveBeenCalled();
                            expect(res.status).toEqual(200);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM twitchChannels')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual([
                                defaultDatabaseEntries[1],
                                defaultDatabaseEntries[2],
                                defaultDatabaseEntries[3],
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should respond with a 500 status code if there was an issue updating the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var runSpy, res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            runSpy = jest.spyOn(db, 'run').mockRejectedValue('Database error');
                            return [4 /*yield*/, (0, supertest_1["default"])(app)["delete"](URI).send(body)];
                        case 1:
                            res = _b.sent();
                            expect(console.error).toHaveBeenCalledWith('DELETE', URI, 'Database error');
                            expect(res.status).toEqual(500);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM twitchChannels')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual(defaultDatabaseEntries);
                            runSpy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should respond with a 404 status code if the entry does not exist in the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app)["delete"](URI).send(body)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, (0, supertest_1["default"])(app)["delete"](URI).send(body)];
                        case 2:
                            res = _b.sent();
                            expect(console.error).not.toHaveBeenCalled();
                            expect(res.status).toEqual(404);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM twitchChannels')];
                        case 3:
                            _a.apply(void 0, [_b.sent()]).toEqual([
                                defaultDatabaseEntries[1],
                                defaultDatabaseEntries[2],
                                defaultDatabaseEntries[3],
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
