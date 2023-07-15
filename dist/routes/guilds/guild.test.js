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
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var supertest_1 = __importDefault(require("supertest"));
var discord_js_1 = require("discord.js");
var database_1 = __importDefault(require("../../database"));
var client_1 = __importDefault(require("../../discord/client"));
var _1 = __importDefault(require("./"));
jest.mock('../../discord/client', function () { return ({
    __esModule: true,
    "default": {
        user: { id: 'user001' },
        guilds: { fetch: jest.fn() }
    }
}); });
describe('/api/guilds/:guild', function () {
    var URI = '/api/guilds/guild001';
    var app = (0, express_1["default"])();
    var db;
    var guilds = new Map();
    var channels = new Map();
    var roles = new Map();
    var members = new Map();
    beforeAll(function () {
        return __awaiter(this, void 0, void 0, function () {
            var fetch;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"]];
                    case 1:
                        db = _a.sent();
                        app.use(body_parser_1["default"].json());
                        app.use('/api/guilds', _1["default"]);
                        return [4 /*yield*/, db.migrate()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO guilds (id) VALUES (?)', ['guild001'])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO guilds (id) VALUES (?)', ['guild002'])];
                    case 4:
                        _a.sent();
                        guilds.set('guild001', {
                            id: 'guild001',
                            name: 'guildname001',
                            iconURL: function () { return 'foo.bar'; },
                            channels: {
                                fetch: jest.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, channels];
                                }); }); })
                            },
                            roles: {
                                fetch: jest.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, roles];
                                }); }); })
                            },
                            members: {
                                fetch: jest.fn(function (id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, members.get(id)];
                                }); }); })
                            }
                        });
                        channels.set('channel001', { id: 'channel001', name: 'channelname001', type: discord_js_1.ChannelType.GuildText });
                        channels.set('channel002', { id: 'channel002', name: 'channelname002', type: discord_js_1.ChannelType.GuildCategory });
                        roles.set('role001', { id: 'role001', name: 'rolename001' });
                        roles.set('role002', { id: 'role002', name: 'rolename002' });
                        members.set('user001', { id: 'user001', setNickname: jest.fn() });
                        fetch = client_1["default"].guilds.fetch;
                        fetch.mockImplementation(function (id) {
                            var guild = guilds.get(id);
                            if (guild)
                                return Promise.resolve(guild);
                            return Promise.reject('Guild not found');
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    afterAll(function () {
        db.close();
    });
    beforeEach(function () {
        jest.clearAllMocks();
    });
    describe('GET', function () {
        it('should respond with data for the guild', function () {
            return __awaiter(this, void 0, void 0, function () {
                var expected, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expected = {
                                id: 'guild001',
                                name: 'guildname001',
                                color: '#19D8B4',
                                nickname: null,
                                timezone: 'UTC',
                                iconURL: 'foo.bar',
                                categories: 1,
                                textChannels: 1,
                                voiceChannels: 0,
                                roles: 2
                            };
                            return [4 /*yield*/, (0, supertest_1["default"])(app).get(URI)];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(200);
                            expect(res.body).toEqual(expected);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 404 if the guild does not exist', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).get('/api/guilds/guild999')];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(404);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('PUT', function () {
        var body = {
            nickname: '',
            color: '#0FFFFF',
            timezone: 'Europe/Berlin'
        };
        it('should update the guild\'s entry in the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send(body)];
                        case 1:
                            res = _b.sent();
                            expect(res.status).toEqual(200);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM guilds')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual([
                                {
                                    id: 'guild001',
                                    nickname: null,
                                    color: '#0FFFFF',
                                    timezone: 'Europe/Berlin'
                                },
                                {
                                    id: 'guild002',
                                    nickname: null,
                                    color: '#19D8B4',
                                    timezone: 'UTC'
                                },
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should update the bot\'s nickname', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send(__assign(__assign({}, body), { nickname: 'foo' }))];
                        case 1:
                            res = _b.sent();
                            expect(members.get('user001').setNickname).toHaveBeenCalledWith('foo');
                            expect(res.status).toEqual(200);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM guilds')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual([
                                {
                                    id: 'guild001',
                                    nickname: 'foo',
                                    color: '#0FFFFF',
                                    timezone: 'Europe/Berlin'
                                },
                                {
                                    id: 'guild002',
                                    nickname: null,
                                    color: '#19D8B4',
                                    timezone: 'UTC'
                                },
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 404 code if the Bot\'s member object could not be resolved', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            guilds.get('guild001').members.fetch.mockRejectedValue('Member not found');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send(body)];
                        case 1:
                            res = _b.sent();
                            expect(res.status).toEqual(404);
                            expect(console.error).toHaveBeenCalledWith('PUT', URI, 'Member not found');
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM guilds')];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).toEqual([
                                {
                                    id: 'guild001',
                                    nickname: 'foo',
                                    color: '#0FFFFF',
                                    timezone: 'Europe/Berlin'
                                },
                                {
                                    id: 'guild002',
                                    nickname: null,
                                    color: '#19D8B4',
                                    timezone: 'UTC'
                                },
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it.todo('should respond with a 404 if the guild does not exist');
    });
});
