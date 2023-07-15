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
var node_fetch_1 = __importDefault(require("node-fetch"));
var fetchTwitterUsers_1 = __importDefault(require("./fetchTwitterUsers"));
var fetchTwitterToken_1 = __importDefault(require("./fetchTwitterToken"));
jest.mock('./fetchTwitterToken', function () { return ({ __esModule: true, "default": jest.fn() }); });
describe('modules.twitter.utils.fetchTwitterUsers()', function () {
    var fetchMock = node_fetch_1["default"];
    var fetchTwitterTokenMock = fetchTwitterToken_1["default"];
    beforeAll(function () {
        var _this = this;
        fetchTwitterTokenMock.mockResolvedValue('twitterToken');
        fetchMock.mockResolvedValue({
            json: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ data: ['foo', 'bar'] })];
            }); }); }
        });
    });
    beforeEach(function () {
        jest.clearAllMocks();
    });
    afterAll(function () {
        jest.restoreAllMocks();
    });
    it('Should fetch users via IDs', function () {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetchTwitterUsers_1["default"])({ ids: ['user001', 'user002'], usernames: [] })];
                    case 1:
                        users = _a.sent();
                        expect(fetchMock).toHaveBeenCalledWith('https://api.twitter.com/2/users/?ids=user001,user002&user.fields=profile_image_url', {
                            headers: {
                                Authorization: 'Bearer twitterToken'
                            }
                        });
                        expect(users).toEqual(['foo', 'bar']);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should fetch users via usernames', function () {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetchTwitterUsers_1["default"])({ ids: [], usernames: ['username001', 'username002'] })];
                    case 1:
                        users = _a.sent();
                        expect(fetchMock).toHaveBeenCalledWith('https://api.twitter.com/2/users/by?usernames=username001,username002&user.fields=profile_image_url', {
                            headers: {
                                Authorization: 'Bearer twitterToken'
                            }
                        });
                        expect(users).toEqual(['foo', 'bar']);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should handle there being no results', function () {
        return __awaiter(this, void 0, void 0, function () {
            var result001, result002;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchMock.mockResolvedValue({ json: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ data: [] })];
                            }); }); } });
                        return [4 /*yield*/, (0, fetchTwitterUsers_1["default"])({ ids: [], usernames: [] })];
                    case 1:
                        result001 = _a.sent();
                        fetchMock.mockResolvedValue({ json: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({})];
                            }); }); } });
                        return [4 /*yield*/, (0, fetchTwitterUsers_1["default"])({ ids: [], usernames: [] })];
                    case 2:
                        result002 = _a.sent();
                        expect(result001).toEqual([]);
                        expect(result002).toEqual([]);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should handle the token being expired', function () {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchMock.mockResolvedValue({ status: 401 });
                        return [4 /*yield*/, (0, fetchTwitterUsers_1["default"])({ ids: [], usernames: [] })];
                    case 1:
                        results = _a.sent();
                        expect(fetchTwitterTokenMock).toHaveBeenCalledTimes(2);
                        expect(fetchTwitterTokenMock).toHaveBeenNthCalledWith(1, false);
                        expect(fetchTwitterTokenMock).toHaveBeenNthCalledWith(2, true);
                        expect(fetchMock).toHaveBeenCalledTimes(2);
                        expect(results).toEqual([]);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should handle the request failing', function () {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchMock.mockRejectedValue('Error message');
                        return [4 /*yield*/, (0, fetchTwitterUsers_1["default"])({ ids: [], usernames: [] })];
                    case 1:
                        results = _a.sent();
                        expect(console.error).toHaveBeenCalledWith('Error message');
                        expect(results).toEqual([]);
                        return [2 /*return*/];
                }
            });
        });
    });
});
