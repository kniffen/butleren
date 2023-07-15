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
var client_1 = __importDefault(require("../../discord/client"));
var _1 = __importDefault(require("./"));
jest.mock('../../discord/client', function () { return ({
    __esModule: true,
    "default": {
        guilds: { fetch: jest.fn() }
    }
}); });
describe('/api/guilds/:guild/roles', function () {
    var app = (0, express_1["default"])();
    var guilds = new Map();
    var roles = new Map();
    beforeAll(function () {
        var _this = this;
        app.use('/api/guilds', _1["default"]);
        guilds.set('guild001', {
            id: 'guild001',
            roles: {
                fetch: jest.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, roles];
                }); }); })
            }
        });
        roles.set('role001', { id: 'role001', name: 'rolename001' });
        roles.set('role002', { id: 'role002', name: 'rolename002' });
        var fetch = client_1["default"].guilds.fetch;
        fetch.mockImplementation(function (id) {
            var guild = guilds.get(id);
            if (guild)
                return Promise.resolve(guild);
            return Promise.reject('Guild not found');
        });
    });
    beforeEach(function () {
        jest.clearAllMocks();
    });
    describe('GET', function () {
        it('should respond with a list of available roles', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).get('/api/guilds/guild001/roles')];
                        case 1:
                            res = _a.sent();
                            expect(res.body).toEqual([
                                { id: 'role001', name: 'rolename001' },
                                { id: 'role002', name: 'rolename002' },
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should respond with a 404 error code if the guild could not be found', function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1["default"])(app).get('/api/guilds/guild999/roles')];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toEqual(404);
                            expect(console.error).toHaveBeenCalledWith('GET', '/api/guilds/guild999/roles', 'Guild not found');
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
