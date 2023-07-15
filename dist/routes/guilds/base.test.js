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
var client_1 = __importDefault(require("../../discord/client"));
var _1 = __importDefault(require("./"));
jest.mock('../../discord/client', function () { return ({
    __esModule: true,
    "default": {
        guilds: { fetch: jest.fn() }
    }
}); });
describe('/api/guilds', function () {
    var URI = '/api/guilds';
    var guilds = new Map();
    var app = (0, express_1["default"])();
    var db;
    beforeAll(function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"]];
                    case 1:
                        db = _a.sent();
                        app.use(URI, _1["default"]);
                        return [4 /*yield*/, db.migrate()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO guilds (id) VALUES (?)', 'guild001')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO guilds (id) VALUES (?)', 'guild002')];
                    case 4:
                        _a.sent();
                        guilds.set('guild001', {
                            id: 'guild001',
                            name: 'guildname001',
                            iconURL: function () { return 'foo.bar'; }
                        });
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        client_1["default"].guilds.fetch.mockImplementation(function (id) { return __awaiter(_this, void 0, void 0, function () {
                            var guild;
                            return __generator(this, function (_a) {
                                guild = guilds.get(id);
                                if (guild)
                                    return [2 /*return*/, Promise.resolve(guild)];
                                return [2 /*return*/, Promise.reject('Guild not found')];
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
        db.close();
    });
    describe('GET', function () {
        it('should respond with the details and settings for all guilds', function () {
            return __awaiter(this, void 0, void 0, function () {
                var expected, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expected = [
                                {
                                    id: 'guild001',
                                    name: 'guildname001',
                                    color: '#19D8B4',
                                    nickname: null,
                                    timezone: 'UTC',
                                    iconURL: 'foo.bar'
                                },
                                {
                                    id: 'guild002',
                                    color: '#19D8B4',
                                    nickname: null,
                                    timezone: 'UTC'
                                }
                            ];
                            return [4 /*yield*/, (0, supertest_1["default"])(app).get(URI)];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(200);
                            expect(res.body).toEqual(expected);
                            expect(console.error).toHaveBeenCalledWith('GET', URI, 'Guild not found');
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
