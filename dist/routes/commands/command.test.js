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
var body_parser_1 = __importDefault(require("body-parser"));
var supertest_1 = __importDefault(require("supertest"));
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
        id: 'mod001',
        name: 'module001',
        commands: {
            cmd001: {
                data: { name: 'command001', description: 'description001', toJSON: function () { return ({ name: 'command001' }); } },
                isLocked: false
            },
            cmd002: {
                data: { name: 'command002', description: 'description002', toJSON: function () { return ({ name: 'command002' }); } },
                isLocked: false
            }
        }
    }
}); });
describe('/api/commands/:guild/:module/:command', function () {
    var app;
    var db;
    var URI = '/api/commands/guild001/mod001/command001';
    var guild = {
        id: 'guild001',
        commands: {
            fetch: jest.fn(),
            create: jest.fn(),
            "delete": jest.fn()
        }
    };
    var guildCommands = new discord_js_1.Collection();
    beforeAll(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"]];
                    case 1:
                        db = _a.sent();
                        app = (0, express_1["default"])();
                        app.use(body_parser_1["default"].json());
                        app.use('/api/commands', _1["default"]);
                        return [4 /*yield*/, db.migrate()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['mod001', 'guild001', true])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    beforeEach(function () {
        var _this = this;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        client_1["default"].guilds.fetch.mockResolvedValue(guild);
        guild.commands.fetch.mockResolvedValue(guildCommands);
        guild.commands.create.mockImplementation(function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var cmd;
                return __generator(this, function (_a) {
                    cmd = guildCommands.set(data.id, data);
                    return [2 /*return*/, cmd];
                });
            });
        });
        guild.commands["delete"].mockImplementation(function (cmd) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, guildCommands["delete"](cmd.id)];
        }); }); });
    });
    afterEach(function () {
        jest.clearAllMocks();
    });
    afterAll(function () {
        jest.restoreAllMocks();
    });
    describe('PUT', function () {
        it('should enable commands', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send({ isEnabled: true })];
                        case 1:
                            res = _a.sent();
                            expect(guild.commands.create).toHaveBeenCalledWith({ name: 'command001' });
                            expect(guild.commands["delete"]).not.toHaveBeenCalled();
                            expect(res.status).toEqual(200);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should disable commands', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send({ isEnabled: false })];
                        case 1:
                            res = _a.sent();
                            expect(guild.commands.create).not.toHaveBeenCalled();
                            expect(guild.commands["delete"]).toHaveBeenCalledWith({ name: 'command001' });
                            expect(res.status).toEqual(200);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should enable the command\'s module if it\'s disabled when enabeling the command', function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, db.run('UPDATE modules SET isEnabled = ? WHERE guildId = ?', false, 'guild001')];
                        case 1:
                            _c.sent();
                            _a = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM modules')];
                        case 2:
                            _a.apply(void 0, [_c.sent()]).toEqual([
                                { id: 'mod001', guildId: 'guild001', isEnabled: 0 }
                            ]);
                            return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send({ isEnabled: true })];
                        case 3:
                            _c.sent();
                            _b = expect;
                            return [4 /*yield*/, db.all('SELECT * FROM modules')];
                        case 4:
                            _b.apply(void 0, [_c.sent()]).toEqual([
                                { id: 'mod001', guildId: 'guild001', isEnabled: 1 }
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 500 status code if the command was not created', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            guild.commands.create.mockRejectedValue('Error message');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send({ isEnabled: true })];
                        case 1:
                            res = _a.sent();
                            expect(console.error).toHaveBeenCalledWith('PUT', URI, 'Error message');
                            expect(res.status).toEqual(500);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 404 status code if the command does not exist', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app)
                                .put('/api/commands/guild001/mod001/command999')
                                .send({ isEnabled: true })];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(404);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it.todo('should respond with a 404 status code if the module does not exist');
        it('should respond with a 404 status code if the guild does not exist', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            client_1["default"].guilds.fetch.mockRejectedValue('Error message');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send({ isEnabled: true })];
                        case 1:
                            res = _a.sent();
                            expect(console.error).toHaveBeenCalledWith('PUT', URI, 'Error message');
                            expect(res.status).toEqual(404);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 400 status code if the request body does not contain the "isEnabled" property', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send({})];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(400);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 500 status code if something went wrong', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            jest.spyOn(db, 'get').mockRejectedValue(new Error('Database error'));
                            return [4 /*yield*/, (0, supertest_1["default"])(app).put(URI).send({ isEnabled: true })];
                        case 1:
                            res = _a.sent();
                            expect(console.error).toHaveBeenCalledWith('PUT', URI, expect.anything());
                            expect(res.status).toEqual(500);
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            db.get.mockRestore();
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
