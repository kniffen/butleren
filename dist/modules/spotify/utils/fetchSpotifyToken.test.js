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
var fetchSpotifyToken_1 = require("./fetchSpotifyToken");
describe('moduled.spotify.utils.fetchSpotifyToken()', function () {
    var fetchMock = node_fetch_1["default"];
    var access_token = 'spotifyToken';
    beforeAll(function () {
        var _this = this;
        fetchMock.mockResolvedValue({
            json: function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, ({
                            access_token: access_token,
                            token_type: 'Bearer',
                            expires_in: 3600
                        })];
                });
            }); }
        });
    });
    beforeEach(function () {
        jest.clearAllMocks();
    });
    afterAll(function () {
        jest.restoreAllMocks();
    });
    it('Should return a new token', function () {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetchSpotifyToken_1.fetchSpotifyToken)()];
                    case 1:
                        token = _a.sent();
                        expect(fetchMock).toHaveBeenCalledWith('https://accounts.spotify.com/api/token', {
                            method: 'POST',
                            body: 'grant_type=client_credentials',
                            headers: {
                                Authorization: "Basic ".concat(Buffer.from("".concat(process.env.SPOTIFY_CLIENT_ID, ":").concat(process.env.SPOTIFY_CLIENT_SECRET)).toString('base64')),
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        });
                        expect(token).toEqual('spotifyToken');
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should return a stored token', function () {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetchSpotifyToken_1.fetchSpotifyToken)()];
                    case 1:
                        token = _a.sent();
                        expect(fetchMock).not.toHaveBeenCalled();
                        expect(token).toEqual('spotifyToken');
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should replace an expired token', function () {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        access_token = 'anotherSpotifyToken';
                        return [4 /*yield*/, (0, fetchSpotifyToken_1.fetchSpotifyToken)(true)];
                    case 1:
                        token = _a.sent();
                        expect(fetchMock).toHaveBeenCalled();
                        expect(token).toEqual('anotherSpotifyToken');
                        return [2 /*return*/];
                }
            });
        });
    });
});
