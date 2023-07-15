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
var discord_js_1 = __importDefault(require("discord.js"));
var fetchTwitchUsers_1 = __importDefault(require("../../utils/fetchTwitchUsers"));
var fetchTwitchStreams_1 = __importDefault(require("../../utils/fetchTwitchStreams"));
var stream_1 = __importDefault(require("./stream"));
jest.mock('../../utils/fetchTwitchUsers', function () { return ({ __esModule: true, "default": jest.fn() }); });
jest.mock('../../utils/fetchTwitchStreams', function () { return ({ __esModule: true, "default": jest.fn() }); });
describe('modules.twitch.commands.twitch.stream()', function () {
    var fetchTwitchUsersMock = fetchTwitchUsers_1["default"];
    var fetchTwitchStreamsMock = fetchTwitchStreams_1["default"];
    var interaction = {
        options: {
            get: function () { return ({ value: 'Foo Bar Baz' }); }
        },
        deferReply: jest.fn(),
        editReply: jest.fn()
    };
    beforeAll(function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                fetchTwitchUsersMock.mockImplementation(function (_a) {
                    var usernames = _a.usernames;
                    return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_b) {
                            return [2 /*return*/, usernames.map(function (username) { return ({
                                    id: "".concat(username, "_id"),
                                    login: "".concat(username, "_login"),
                                    display_name: "".concat(username, "_display_name"),
                                    description: "".concat(username, "_description"),
                                    profile_image_url: "https://".concat(username, "_profile_image_url"),
                                    offline_image_url: "https://".concat(username, "_offline_image_url_{width}x{height}.ext")
                                }); })];
                        });
                    });
                });
                fetchTwitchStreamsMock.mockImplementation(function (_a) {
                    var ids = _a.ids;
                    return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_b) {
                            return [2 /*return*/, ids.map(function (id) { return ({
                                    title: "".concat(id, "_stream_title"),
                                    thumbnail_url: "https://".concat(id, "_stream_thumbnail_url_{width}x{height}.ext"),
                                    game_name: "".concat(id, "_stream_game_name"),
                                    viewer_count: 123456,
                                    started_at: '2000-01-01T00:00:00Z'
                                }); })];
                        });
                    });
                });
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
    it('Should respond with info about the stream', function () {
        return __awaiter(this, void 0, void 0, function () {
            var expectedEmbed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedEmbed = new discord_js_1["default"].EmbedBuilder();
                        expectedEmbed.setTitle('foo_display_name is streaming on Twitch');
                        expectedEmbed.setColor('#9146FF');
                        expectedEmbed.setURL('https://twitch.tv/foo_login');
                        expectedEmbed.setDescription('**foo_id_stream_title**');
                        expectedEmbed.setThumbnail('https://foo_profile_image_url');
                        expectedEmbed.setImage('https://foo_id_stream_thumbnail_url_400x225.ext');
                        expectedEmbed.addFields({ name: 'Category', value: 'foo_id_stream_game_name' }, { name: 'Viewers', value: '123,456' }, { name: 'Started', value: '<t:946684800:R>' });
                        return [4 /*yield*/, (0, stream_1["default"])(interaction)];
                    case 1:
                        _a.sent();
                        expect(interaction.deferReply).toHaveBeenCalled();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(fetchTwitchUsersMock).toHaveBeenCalledWith({ ids: [], usernames: ['foo'] });
                        expect(fetchTwitchStreamsMock).toHaveBeenCalledWith({ ids: ['foo_id'], usernames: [] });
                        expect(interaction.editReply).toHaveBeenCalledWith({
                            embeds: [expectedEmbed]
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should respond with info about channel if the stream is offline', function () {
        return __awaiter(this, void 0, void 0, function () {
            var expectedEmbed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedEmbed = new discord_js_1["default"].EmbedBuilder();
                        expectedEmbed.setTitle('foo_display_name is offline');
                        expectedEmbed.setColor('#9146FF');
                        expectedEmbed.setURL('https://twitch.tv/foo_login');
                        expectedEmbed.setDescription('**foo_description**');
                        expectedEmbed.setThumbnail('https://foo_profile_image_url');
                        expectedEmbed.setImage('https://foo_offline_image_url_400x225.ext');
                        fetchTwitchStreamsMock.mockResolvedValue([]);
                        return [4 /*yield*/, (0, stream_1["default"])(interaction)];
                    case 1:
                        _a.sent();
                        expect(interaction.deferReply).toHaveBeenCalled();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(fetchTwitchUsersMock).toHaveBeenCalledWith({ ids: [], usernames: ['foo'] });
                        expect(fetchTwitchStreamsMock).toHaveBeenCalledWith({ ids: ['foo_id'], usernames: [] });
                        expect(interaction.editReply).toHaveBeenCalledWith({
                            embeds: [expectedEmbed]
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    it.todo('Should handle the reply failing to be sent');
    it('Should respond with a fallback message if the channel cannot be found', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchTwitchUsersMock.mockResolvedValue([]);
                        return [4 /*yield*/, (0, stream_1["default"])(interaction)];
                    case 1:
                        _a.sent();
                        expect(interaction.deferReply).toHaveBeenCalled();
                        expect(console.error).not.toHaveBeenCalled();
                        expect(fetchTwitchUsersMock).toHaveBeenCalledWith({ ids: [], usernames: ['foo'] });
                        expect(fetchTwitchStreamsMock).not.toHaveBeenCalled();
                        expect(interaction.editReply).toHaveBeenCalledWith({
                            content: 'Sorry, i was unable to find "Foo" on twitch :('
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
});
