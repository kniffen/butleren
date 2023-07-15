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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var supertest_1 = __importDefault(require("supertest"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var index_1 = __importDefault(require("./index"));
var database_1 = __importDefault(require("../../../database"));
var utils_1 = require("../utils");
jest.mock('../utils/fetchSpotifyShows', function () { return ({ __esModule: true, fetchSpotifyShows: jest.fn() }); });
jest.mock('../utils/fetchSpotifyShowEpisodes', function () { return ({ __esModule: true, fetchSpotifyShowEpisodes: jest.fn() }); });
describe('/api/spotify/:guild/shows', function () {
    var fetchSpotifyShowsMock = utils_1.fetchSpotifyShows;
    var fetchSpotifyShowEpisodesMock = utils_1.fetchSpotifyShowEpisodes;
    var URI = '/api/spotify/guild001/shows';
    var app;
    var db;
    beforeAll(function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app = (0, express_1["default"])();
                        return [4 /*yield*/, database_1["default"]];
                    case 1:
                        db = _a.sent();
                        app.use(body_parser_1["default"].urlencoded({ extended: false }));
                        app.use(body_parser_1["default"].json());
                        app.use('/api/spotify', index_1["default"]);
                        return [4 /*yield*/, db.migrate()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO spotifyShows (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild001', 'show001', 'channel001'])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO spotifyShows (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild001', 'show002', 'channel002'])];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO spotifyShows (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild002', 'show001', 'channel003'])];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO spotifyShows (guildId, id, notificationChannelId) VALUES (?,?,?)', ['guild002', 'show003', 'channel004'])];
                    case 6:
                        _a.sent();
                        fetchSpotifyShowsMock.mockImplementation(function (ids) {
                            if (ids === void 0) { ids = []; }
                            return __awaiter(_this, void 0, void 0, function () {
                                var shows;
                                return __generator(this, function (_a) {
                                    shows = ids === null || ids === void 0 ? void 0 : ids.map(function (id, i) { return ({
                                        id: id,
                                        name: "".concat(id, "-name-").concat(i),
                                        publisher: "".concat(id, "-publisher-").concat(i),
                                        description: "".concat(id, "-description-").concat(i),
                                        external_urls: { spotify: "".concat(id, "-url-").concat(i) }
                                    }); });
                                    return [2 /*return*/, shows];
                                });
                            });
                        });
                        fetchSpotifyShowEpisodesMock.mockImplementation(function (id) { return __awaiter(_this, void 0, void 0, function () {
                            var episodes;
                            return __generator(this, function (_a) {
                                episodes = [
                                    { id: "".concat(id, "_episode001") },
                                    { id: "".concat(id, "_episode002") },
                                    { id: "".concat(id, "_episode003") },
                                ];
                                return [2 /*return*/, episodes];
                            });
                        }); });
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
    describe('GET', function () {
        it('Should respond with an array of shows for the guild', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).get(URI)];
                        case 1:
                            res = _a.sent();
                            expect(res.body).toEqual([
                                {
                                    id: 'show001',
                                    name: 'show001-name-0',
                                    description: 'show001-description-0',
                                    publisher: 'show001-publisher-0',
                                    url: 'show001-url-0',
                                    notificationChannelId: 'channel001',
                                    notificationRoleId: null
                                },
                                {
                                    id: 'show002',
                                    name: 'show002-name-1',
                                    description: 'show002-description-1',
                                    publisher: 'show002-publisher-1',
                                    url: 'show002-url-1',
                                    notificationChannelId: 'channel002',
                                    notificationRoleId: null
                                }
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should handle there being no shows for the IDs', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fetchSpotifyShowsMock.mockResolvedValue([]);
                            return [4 /*yield*/, (0, supertest_1["default"])(app).get(URI)];
                        case 1:
                            res = _a.sent();
                            expect(res.body).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should respond with a 500 status code if there was an issue reading from the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var dbAllSpy, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dbAllSpy = jest.spyOn(db, 'all');
                            dbAllSpy.mockRejectedValue('Database error');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).get(URI)];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(500);
                            expect(console.error).toHaveBeenCalledWith('GET', URI, 'Database error');
                            dbAllSpy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('POST', function () {
        var body = {
            id: 'show999',
            notificationChannelId: 'channel001',
            notificationRoleId: 'role001'
        };
        it('Should respond with a 500 status code if there was an issue adding the show to the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var dbRunSpy, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dbRunSpy = jest.spyOn(db, 'run');
                            dbRunSpy.mockRejectedValue('Database error');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).post(URI).send(body)];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(500);
                            expect(console.error).toHaveBeenCalledWith('POST', URI, 'Database error');
                            dbRunSpy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should add a show to the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).post(URI).send(body)];
                        case 1:
                            res = _b.sent();
                            expect(res.status).toEqual(201);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM spotifyShows')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual([
                                { guildId: 'guild001', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: null },
                                { guildId: 'guild001', id: 'show002', latestEpisodeId: null, notificationChannelId: 'channel002', notificationRoleId: null },
                                { guildId: 'guild002', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel003', notificationRoleId: null },
                                { guildId: 'guild002', id: 'show003', latestEpisodeId: null, notificationChannelId: 'channel004', notificationRoleId: null },
                                { guildId: 'guild001', id: 'show999', latestEpisodeId: 'show999_episode001', notificationChannelId: 'channel001', notificationRoleId: 'role001' },
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should handle the show having no episodes', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            fetchSpotifyShowEpisodesMock.mockResolvedValue([]);
                            return [4 /*yield*/, db.run('DELETE FROM spotifyShows WHERE id = ? AND guildId = ?', ['show999', 'guild001'])];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, (0, supertest_1["default"])(app).post(URI).send(body)];
                        case 2:
                            res = _b.sent();
                            expect(console.error).not.toHaveBeenCalled();
                            expect(res.status).toEqual(201);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM spotifyShows')];
                        case 3:
                            _a.apply(void 0, [_b.sent()]).toEqual([
                                { guildId: 'guild001', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: null },
                                { guildId: 'guild001', id: 'show002', latestEpisodeId: null, notificationChannelId: 'channel002', notificationRoleId: null },
                                { guildId: 'guild002', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel003', notificationRoleId: null },
                                { guildId: 'guild002', id: 'show003', latestEpisodeId: null, notificationChannelId: 'channel004', notificationRoleId: null },
                                { guildId: 'guild001', id: 'show999', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: 'role001' },
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should respond with a 409 status code if entry already exists', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).post(URI).send(body)];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(409);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should respond with a 400 status code if there were missing body properties', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).post(URI).send({})];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(400);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('PATCH', function () {
        var expectedEntries = [
            { guildId: 'guild001', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel999', notificationRoleId: 'role999' },
            { guildId: 'guild001', id: 'show002', latestEpisodeId: null, notificationChannelId: 'channel002', notificationRoleId: null },
            { guildId: 'guild002', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel003', notificationRoleId: null },
            { guildId: 'guild002', id: 'show003', latestEpisodeId: null, notificationChannelId: 'channel004', notificationRoleId: null },
            { guildId: 'guild001', id: 'show999', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: 'role001' },
        ];
        var body = {
            id: 'show001',
            notificationChannelId: 'channel999',
            notificationRoleId: 'role999'
        };
        it('Should update a show entry in the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).patch(URI).send(body)];
                        case 1:
                            res = _b.sent();
                            expect(res.status).toEqual(200);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM spotifyShows')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual(expectedEntries);
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
                            return [4 /*yield*/, db.all('SELECT * FROM spotifyShows')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual(expectedEntries);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should respond with a 404 status code if the show does not exist in the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).patch(URI).send(__assign(__assign({}, body), { id: 'show111' }))];
                        case 1:
                            res = _b.sent();
                            expect(res.status).toEqual(404);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM spotifyShows')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual(expectedEntries);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should respond with a 500 status code if there was an issue updating the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var dbRunSpy, res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            dbRunSpy = jest.spyOn(db, 'run');
                            dbRunSpy.mockRejectedValue('Database error');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).patch(URI).send(body)];
                        case 1:
                            res = _b.sent();
                            expect(res.status).toEqual(500);
                            expect(console.error).toHaveBeenCalledWith('PATCH', URI, 'Database error');
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM spotifyShows')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual(expectedEntries);
                            dbRunSpy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('DELETE', function () {
        var expectedEntries = [
            { guildId: 'guild001', id: 'show002', latestEpisodeId: null, notificationChannelId: 'channel002', notificationRoleId: null },
            { guildId: 'guild002', id: 'show001', latestEpisodeId: null, notificationChannelId: 'channel003', notificationRoleId: null },
            { guildId: 'guild002', id: 'show003', latestEpisodeId: null, notificationChannelId: 'channel004', notificationRoleId: null },
            { guildId: 'guild001', id: 'show999', latestEpisodeId: null, notificationChannelId: 'channel001', notificationRoleId: 'role001' },
        ];
        var body = {
            id: 'show001'
        };
        it('Should respond with a 500 status code if there was an issue updating the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var dbRunSpy, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dbRunSpy = jest.spyOn(db, 'run');
                            dbRunSpy.mockRejectedValue('Database error');
                            return [4 /*yield*/, (0, supertest_1["default"])(app)["delete"](URI).send(body)];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(500);
                            expect(console.error).toHaveBeenCalledWith('DELETE', URI, 'Database error');
                            dbRunSpy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should delete a show entry in the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app)["delete"](URI).send(body)];
                        case 1:
                            res = _b.sent();
                            expect(res.status).toEqual(200);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM spotifyShows')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual(expectedEntries);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should respond with a 404 status code if the show does not exist in the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app)["delete"](URI).send(body)];
                        case 1:
                            res = _b.sent();
                            expect(res.status).toEqual(404);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM spotifyShows')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual(expectedEntries);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
