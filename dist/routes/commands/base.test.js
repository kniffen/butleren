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
var discord_js_1 = require("discord.js");
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
jest.mock('../../modules/index', function () { return ({
    __esModule: true,
    mod001: {
        name: 'module001',
        commands: {
            cmd001: {
                data: { name: 'command001', description: 'description001' },
                isLocked: false
            },
            cmd002: {
                data: { name: 'command002', description: 'description002' },
                isLocked: false
            }
        }
    },
    mod002: {
        name: 'module002',
        commands: {
            cmd003: {
                data: { name: 'command003', description: 'description003' },
                isLocked: true
            }
        }
    },
    mod003: {
        name: 'module003'
    }
}); });
describe('/api/commands/:guild', function () {
    var app;
    var URI = '/api/commands/guild001';
    var guild = {
        commands: {
            fetch: jest.fn()
        }
    };
    var guildCommands = new discord_js_1.Collection();
    guildCommands.set('cmd001', { name: 'command001' });
    guildCommands.set('cmd003', { name: 'command003' });
    beforeAll(function () {
        app = (0, express_1["default"])();
        app.use('/api/commands', _1["default"]);
    });
    beforeEach(function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        client_1["default"].guilds.fetch.mockResolvedValue(guild);
        guild.commands.fetch.mockResolvedValue(guildCommands);
    });
    afterEach(function () {
        jest.clearAllMocks();
    });
    afterAll(function () {
        jest.restoreAllMocks();
    });
    describe('GET', function () {
        it('should respond with an array of commands', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).get(URI)];
                        case 1:
                            res = _a.sent();
                            expect(res.body).toEqual([
                                {
                                    id: 'cmd001',
                                    name: 'command001',
                                    description: 'description001',
                                    isEnabled: true,
                                    isLocked: false,
                                    module: { id: 'mod001', name: 'module001' }
                                },
                                {
                                    id: 'cmd002',
                                    name: 'command002',
                                    description: 'description002',
                                    isEnabled: false,
                                    isLocked: false,
                                    module: { id: 'mod001', name: 'module001' }
                                },
                                {
                                    id: 'cmd003',
                                    name: 'command003',
                                    description: 'description003',
                                    isEnabled: true,
                                    isLocked: true,
                                    module: { id: 'mod002', name: 'module002' }
                                }
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 404 status code if there was an issue fetching commands from the guild', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            guild.commands.fetch.mockRejectedValue('Error message');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).get(URI)];
                        case 1:
                            res = _a.sent();
                            expect(console.error).toHaveBeenCalledWith('GET', URI, 'Error message');
                            expect(res.status).toEqual(404);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should resport with a 404 status code if the guild does not exist', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            client_1["default"].guilds.fetch.mockRejectedValue('Error message');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).get(URI)];
                        case 1:
                            res = _a.sent();
                            expect(console.error).toHaveBeenCalledWith('GET', URI, 'Error message');
                            expect(res.status).toEqual(404);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should resport with a 500 status code if something went wrong fetching the commands', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            client_1["default"].guilds.fetch.mockResolvedValue('foobar');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).get(URI)];
                        case 1:
                            res = _a.sent();
                            expect(console.error).toHaveBeenCalledWith('GET', URI, expect.anything());
                            expect(res.status).toEqual(500);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
