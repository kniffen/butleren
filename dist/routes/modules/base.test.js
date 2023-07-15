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
var database_1 = __importDefault(require("../../database"));
var _1 = __importDefault(require("./"));
jest.mock('../../database', function () {
    var sqlite3 = jest.requireActual('sqlite3');
    var open = jest.requireActual('sqlite').open;
    return {
        __esModule: true,
        "default": open({
            filename: ':memory:',
            driver: sqlite3.Database
        })
    };
});
jest.mock('../../modules', function () { return ({
    __esModule: true,
    mod001: {
        id: 'module001',
        name: 'moduleName001',
        description: 'moduleDescription001',
        isLocked: false,
        commands: {
            cmd001: {
                data: { name: 'command001' }
            }
        }
    },
    mod002: {
        id: 'module002',
        name: 'moduleName002',
        description: 'moduleDescription002',
        isLocked: false
    },
    mod003: {
        id: 'module003',
        name: 'moduleName003',
        description: 'moduleDescription003',
        isLocked: true
    }
}); });
describe('/api/modules/:guild', function () {
    var app = (0, express_1["default"])();
    var db;
    beforeAll(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app.use('/api/modules', _1["default"]);
                        return [4 /*yield*/, database_1["default"]];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.migrate()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['module001', 'guild001', true])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['module002', 'guild001', false])];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['module001', 'guild002', false])];
                    case 5:
                        _a.sent();
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
        db.close();
    });
    describe('GET', function () {
        it('should respond with all the module data for the specified guild', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).get('/api/modules/guild001')];
                        case 1:
                            res = _a.sent();
                            expect(res.body).toEqual([
                                {
                                    id: undefined,
                                    name: undefined,
                                    description: undefined,
                                    commands: [],
                                    isEnabled: true,
                                    isLocked: undefined
                                },
                                {
                                    id: 'module001',
                                    name: 'moduleName001',
                                    description: 'moduleDescription001',
                                    commands: [{ name: 'command001' }],
                                    isEnabled: true,
                                    isLocked: false
                                },
                                {
                                    id: 'module002',
                                    name: 'moduleName002',
                                    description: 'moduleDescription002',
                                    commands: [],
                                    isEnabled: false,
                                    isLocked: false
                                },
                                {
                                    id: 'module003',
                                    name: 'moduleName003',
                                    description: 'moduleDescription003',
                                    commands: [],
                                    isEnabled: true,
                                    isLocked: true
                                }
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 404 of the guild has no modules in the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).get('/api/modules/guild999')];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(404);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 500 status code if there was an issue reading the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            jest.spyOn(db, 'all').mockRejectedValue('SQL error');
                            return [4 /*yield*/, (0, supertest_1["default"])(app).get('/api/modules/guild001')];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(500);
                            expect(console.error).toHaveBeenCalledWith('GET', '/api/modules/guild001', 'SQL error');
                            db.all.mockRestore();
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
