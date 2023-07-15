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
exports.__esModule = true;
var fetchSpotifySearch_1 = require("../../utils/fetchSpotifySearch");
var fetchSpotifyShowEpisodes_1 = require("../../utils/fetchSpotifyShowEpisodes");
var latestepisode_1 = require("./latestepisode");
jest.mock('../../utils/fetchSpotifySearch', function () { return ({ __esModule: true, fetchSpotifySearch: jest.fn() }); });
jest.mock('../../utils/fetchSpotifyShowEpisodes', function () { return ({ __esModule: true, fetchSpotifyShowEpisodes: jest.fn() }); });
describe('modules.spotify.commands.spotify.latestepisode()', function () {
    var fetchSpotifySearchMock = fetchSpotifySearch_1.fetchSpotifySearch;
    var fetchSpotifyShowEpisodesMock = fetchSpotifyShowEpisodes_1.fetchSpotifyShowEpisodes;
    var interaction = {
        options: {
            get: function () { return ({ value: 'userInput001' }); }
        },
        deferReply: jest.fn(),
        editReply: jest.fn()
    };
    beforeAll(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                fetchSpotifySearchMock.mockResolvedValue({
                    shows: {
                        items: [
                            { id: 'show001', name: 'showName001', external_urls: { spotify: 'spotifyShowURL001' } },
                            { id: 'show002', name: 'showName002', external_urls: { spotify: 'spotifyShowURL002' } },
                        ]
                    }
                });
                fetchSpotifyShowEpisodesMock.mockResolvedValue([
                    { release_date: '1970-01-01', external_urls: { spotify: 'spotifyEpisodeURL001' } },
                    { release_date: '2020-05-06', external_urls: { spotify: 'spotifyEpisodeURL002' } },
                    { release_date: '1980-02-03', external_urls: { spotify: 'spotifyEpisodeURL003' } },
                ]);
                return [2 /*return*/];
            });
        });
    });
    beforeEach(function () {
        jest.clearAllMocks();
    });
    afterAll(function () {
        jest.restoreAllMocks();
    });
    it('Should respond with the latest episode for a show', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, latestepisode_1.latestEpisodeSubCommand)(interaction)];
                    case 1:
                        _a.sent();
                        expect(interaction.deferReply).toHaveBeenCalled();
                        expect(interaction.editReply).toHaveBeenCalledWith({
                            content: 'Latest episode from showName001\nspotifyEpisodeURL002'
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should respond with a specific message if the show has no episodes', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchSpotifyShowEpisodesMock.mockResolvedValue([]);
                        return [4 /*yield*/, (0, latestepisode_1.latestEpisodeSubCommand)(interaction)];
                    case 1:
                        _a.sent();
                        expect(interaction.deferReply).toHaveBeenCalled();
                        expect(interaction.editReply).toHaveBeenCalledWith({
                            content: 'showName001 does not appear to have any recent episodes\nspotifyShowURL001'
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should respond with a specific message if the show does not exist', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchSpotifySearchMock.mockResolvedValue({});
                        return [4 /*yield*/, (0, latestepisode_1.latestEpisodeSubCommand)(interaction)];
                    case 1:
                        _a.sent();
                        expect(interaction.deferReply).toHaveBeenCalled();
                        expect(interaction.editReply).toHaveBeenCalledWith({
                            content: 'Sorry, I was unable to fetch that show for you :('
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
});
