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
var fetchSpotifyShows_1 = require("./fetchSpotifyShows");
var fetchSpotifyToken_1 = require("./fetchSpotifyToken");
jest.mock('./fetchSpotifyToken', function () { return ({ __esModule: true, fetchSpotifyToken: jest.fn() }); });
describe('moduled.spotify.utils.fetchSpotifyShows()', function () {
    var fetchMock = node_fetch_1["default"];
    var fetchSpotifyTokenMock = fetchSpotifyToken_1.fetchSpotifyToken;
    beforeAll(function () {
        var _this = this;
        fetchSpotifyTokenMock.mockResolvedValue('spotifyToken');
        fetchMock.mockResolvedValue({
            json: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ shows: ['foo', 'bar'] })];
            }); }); }
        });
    });
    beforeEach(function () {
        jest.clearAllMocks();
    });
    afterAll(function () {
        jest.restoreAllMocks();
    });
    it('Should return an array of shows', function () {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetchSpotifyShows_1.fetchSpotifyShows)(['show001', 'show002'])];
                    case 1:
                        results = _a.sent();
                        expect(fetchMock).toHaveBeenCalledWith('https://api.spotify.com/v1/shows?ids=show001,show002&market=US', {
                            headers: {
                                Authorization: 'Bearer spotifyToken',
                                'Content-Type': 'application/json'
                            }
                        });
                        expect(results).toEqual(['foo', 'bar']);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should use arguments in the URI', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetchSpotifyShows_1.fetchSpotifyShows)(['show001', 'show002'], 'market001')];
                    case 1:
                        _a.sent();
                        expect(fetchMock).toHaveBeenCalledWith('https://api.spotify.com/v1/shows?ids=show001,show002&market=market001', expect.anything());
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should handle there being no shows', function () {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchMock.mockResolvedValue({
                            json: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ([])];
                            }); }); }
                        });
                        return [4 /*yield*/, (0, fetchSpotifyShows_1.fetchSpotifyShows)(['show001', 'show002'])];
                    case 1:
                        results = _a.sent();
                        expect(results).toEqual([]);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should handle the token being invalid', function () {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchMock.mockResolvedValue({ status: 401 });
                        return [4 /*yield*/, (0, fetchSpotifyShows_1.fetchSpotifyShows)(['show001', 'show002'])];
                    case 1:
                        results = _a.sent();
                        expect(fetchSpotifyTokenMock).toHaveBeenCalledTimes(2);
                        expect(fetchSpotifyTokenMock).toHaveBeenNthCalledWith(1, false);
                        expect(fetchSpotifyTokenMock).toHaveBeenNthCalledWith(2, true);
                        expect(fetchMock).toHaveBeenCalledTimes(2);
                        expect(fetchMock).toHaveBeenNthCalledWith(1, 'https://api.spotify.com/v1/shows?ids=show001,show002&market=US', expect.anything());
                        expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://api.spotify.com/v1/shows?ids=show001,show002&market=US', expect.anything());
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
                        return [4 /*yield*/, (0, fetchSpotifyShows_1.fetchSpotifyShows)(['show001', 'show002'])];
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
