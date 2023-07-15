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
var express_1 = __importDefault(require("express"));
var supertest_1 = __importDefault(require("supertest"));
var body_parser_1 = __importDefault(require("body-parser"));
var discord_js_1 = require("discord.js");
var database_1 = __importDefault(require("../../database"));
var client_1 = __importDefault(require("../../discord/client"));
var _1 = __importDefault(require("./"));
jest.mock('../../discord/client', function () { return ({
    __esModule: true,
    "default": {
        guilds: {
            fetch: jest.fn()
        }
    }
}); });
jest.mock('../../modules', function () { return ({
    __esModule: true,
    mod001: {
        id: 'module001',
        name: 'modulename001',
        description: 'moduledescription001',
        commands: {
            cmd001: {
                data: {
                    name: 'command001',
                    toJSON: function () { return 'commanddata001'; }
                }
            },
            cmd002: {
                data: {
                    name: 'command002',
                    toJSON: function () { return 'commanddata002'; }
                }
            }
        }
    },
    mod002: {
        id: 'module002',
        name: 'modulename002',
        description: 'moduledescription002',
        commands: {
            cmd003: {
                data: {
                    name: 'command003',
                    toJSON: function () { return 'commanddata003'; }
                }
            }
        }
    },
    mod003: {
        id: 'module003',
        name: 'modulename003',
        description: 'moduledescription003',
        commands: {
            cmd004: {
                data: {
                    name: 'command004',
                    toJSON: function () { return 'commanddata004'; }
                }
            }
        }
    }
}); });
describe('/api/modules/:guild/:module', function () {
    var app = (0, express_1["default"])();
    var db;
    var guild = {
        id: 'guild001',
        commands: {
            fetch: jest.fn(),
            "delete": jest.fn(),
            create: jest.fn()
        }
    };
    var guildCommands = new discord_js_1.Collection();
    guildCommands.set('guildCmd001', { name: 'command001' });
    guildCommands.set('guildCmd002', { name: 'command002' });
    guildCommands.set('guildCmd003', { name: 'command003' });
    guildCommands.set('guildCmd004', { name: 'command004' });
    beforeAll(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app.use(body_parser_1["default"].json());
                        app.use('/api/modules', _1["default"]);
                        return [4 /*yield*/, database_1["default"]];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.migrate()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['module001', 'guild001', false])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['module002', 'guild001', true])];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['module001', 'guild002', true])];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    beforeEach(function () {
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        client_1["default"].guilds.fetch.mockResolvedValue(guild);
        // @ts-ignore
        guild.commands.fetch.mockResolvedValue(guildCommands);
        // @ts-ignore
        guild.commands["delete"].mockResolvedValue('applicationCommand');
        // @ts-ignore
        guild.commands.create.mockResolvedValue('applicationCommand');
        /* eslint-enable @typescript-eslint/ban-ts-comment */
    });
    afterEach(function () {
        jest.clearAllMocks();
    });
    afterAll(function () {
        jest.restoreAllMocks();
        db.close();
    });
    describe('GET', function () {
        it('should respond with data about the module', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res001, res002, res003;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).get('/api/modules/guild001/module001')];
                        case 1:
                            res001 = _a.sent();
                            return [4 /*yield*/, (0, supertest_1["default"])(app).get('/api/modules/guild001/module002')];
                        case 2:
                            res002 = _a.sent();
                            return [4 /*yield*/, (0, supertest_1["default"])(app).get('/api/modules/guild001/module003')];
                        case 3:
                            res003 = _a.sent();
                            expect(res001.body).toEqual({
                                id: 'module001',
                                name: 'modulename001',
                                description: 'moduledescription001',
                                isEnabled: false,
                                isLocked: false
                            });
                            expect(res002.body).toEqual({
                                id: 'module002',
                                name: 'modulename002',
                                description: 'moduledescription002',
                                isEnabled: true,
                                isLocked: false
                            });
                            expect(res003.body).toEqual({
                                id: 'module003',
                                name: 'modulename003',
                                description: 'moduledescription003',
                                isEnabled: true,
                                isLocked: true
                            });
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should handle getting data from the database being rejected', function () {
            return __awaiter(this, void 0, void 0, function () {
                var getSpy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            getSpy = jest.spyOn(db, 'get').mockRejectedValue('Get from database error');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).get('/api/modules/guild001/module001')];
                        case 1:
                            _a.sent();
                            expect(console.error).toHaveBeenCalledWith('GET', '/api/modules/guild001/module001', 'Get from database error');
                            getSpy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 404 status code if the module does not exist', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).get('/api/modules/guild001/module999')];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(404);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 404 status code if the guild does not exist', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            client_1["default"].guilds.fetch
                                .mockRejectedValue('Guild not found');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).get('/api/modules/guild001/module001')];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(404);
                            expect(console.error).toHaveBeenCalledWith('GET', '/api/modules/guild001/module001', 'Guild not found');
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('PUT', function () {
        var URI = '/api/modules/guild001/module001';
        it('should update module properties', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res001, _a, res002, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send({ isEnabled: true })];
                        case 1:
                            res001 = _c.sent();
                            expect(res001.status).toEqual(200);
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM modules')];
                        case 2:
                            _a.apply(void 0, [_c.sent()]).toEqual([
                                { id: 'module001', guildId: 'guild001', isEnabled: 1 },
                                { id: 'module002', guildId: 'guild001', isEnabled: 1 },
                                { id: 'module001', guildId: 'guild002', isEnabled: 1 },
                            ]);
                            return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send({ isEnabled: false })];
                        case 3:
                            res002 = _c.sent();
                            expect(res002.status).toEqual(200);
                            _b = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM modules')];
                        case 4:
                            _b.apply(void 0, [_c.sent()]).toEqual([
                                { id: 'module001', guildId: 'guild001', isEnabled: 0 },
                                { id: 'module002', guildId: 'guild001', isEnabled: 1 },
                                { id: 'module001', guildId: 'guild002', isEnabled: 1 },
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should create and delete commands associated with the module', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send({ isEnabled: true })];
                        case 1:
                            _a.sent();
                            expect(guild.commands["delete"]).not.toHaveBeenCalled();
                            expect(guild.commands.create).toHaveBeenCalledTimes(2);
                            expect(guild.commands.create).toHaveBeenNthCalledWith(1, 'commanddata001');
                            expect(guild.commands.create).toHaveBeenNthCalledWith(2, 'commanddata002');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send({ isEnabled: false })];
                        case 2:
                            _a.sent();
                            expect(guild.commands.create).toHaveBeenCalledTimes(2);
                            expect(guild.commands["delete"]).toHaveBeenCalledTimes(2);
                            expect(guild.commands["delete"]).toHaveBeenNthCalledWith(1, { name: 'command001' });
                            expect(guild.commands["delete"]).toHaveBeenNthCalledWith(2, { name: 'command002' });
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 500 status code if there were issues updating the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var err, runSpy, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            err = new Error('Database update error');
                            runSpy = jest.spyOn(db, 'run').mockRejectedValue(err);
                            return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send({ isEnabled: true })];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(500);
                            expect(console.error).toHaveBeenCalledWith('PUT', URI, err);
                            runSpy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 500 status code if creating a command was rejected', function () {
            return __awaiter(this, void 0, void 0, function () {
                var err, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            err = new Error('Commands create error');
                            guild.commands.create
                                .mockRejectedValue(err);
                            return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send({ isEnabled: true })];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(500);
                            expect(console.error).toHaveBeenCalledWith('PUT', URI, err);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 500 status code if deleting a command was rejected', function () {
            return __awaiter(this, void 0, void 0, function () {
                var err, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            err = new Error('Commands delete error');
                            guild.commands["delete"]
                                .mockRejectedValue(err);
                            return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send({ isEnabled: false })];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(500);
                            expect(console.error).toHaveBeenCalledWith('PUT', URI, err);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 500 status code if fetching guild command was rejected', function () {
            return __awaiter(this, void 0, void 0, function () {
                var err, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            err = new Error('Commands fetch error');
                            guild.commands.fetch
                                .mockRejectedValue(err);
                            return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send({ isEnabled: true })];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(500);
                            expect(console.error).toHaveBeenCalledWith('PUT', URI, err);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 404 status code if the module does not exist in the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).put('/api/modules/guild001/module999').send({ isEnabled: true })];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(404);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 500 status code if there was an rejection when reading the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var getSpy, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            getSpy = jest.spyOn(db, 'get').mockRejectedValue('Read database error');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send({ isEnabled: true })];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(500);
                            getSpy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 404 status code if the guild does not exist', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res001, res002;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).put('/api/modules/guild999/module001').send({ isEnabled: true })];
                        case 1:
                            res001 = _a.sent();
                            client_1["default"].guilds.fetch
                                .mockRejectedValue('Guild not found');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).put('/api/modules/guild999/module001').send({ isEnabled: true })];
                        case 2:
                            res002 = _a.sent();
                            expect(res001.status).toEqual(404);
                            expect(res002.status).toEqual(404);
                            expect(console.error).toHaveBeenCalledWith('PUT', '/api/modules/guild999/module001', 'Guild not found');
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
