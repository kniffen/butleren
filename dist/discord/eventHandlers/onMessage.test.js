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
var discord_js_1 = require("discord.js");
var database_1 = __importDefault(require("../../database"));
var modules_1 = __importDefault(require("../../modules"));
var onMessage_1 = __importDefault(require("./onMessage"));
jest.mock('../../modules', function () {
    var ChannelType = jest.requireActual('discord.js').ChannelType;
    return [
        {
            id: 'static_module',
            allowedChannelTypes: [ChannelType.GuildText],
            onMessage: jest.fn(),
            isLocked: true
        },
        {
            id: 'disabled_module',
            onMessage: jest.fn(),
            allowedChannelTypes: [ChannelType.GuildText, ChannelType.DM],
            isLocked: false
        },
        {
            id: 'enabled_module',
            onMessage: jest.fn(),
            allowedChannelTypes: [ChannelType.GuildText, ChannelType.DM],
            isLocked: false
        }
    ];
});
describe('discord.eventHandlers.onMessage()', function () {
    var db;
    var staticModule = modules_1["default"][0];
    var disabledModule = modules_1["default"][1];
    var enabledModule = modules_1["default"][2];
    beforeAll(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"]];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.migrate()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, Promise.all([
                                db.run('INSERT INTO guilds (id) VALUES (?)', ['guild001']),
                                db.run('INSERT INTO modules (id, guildId) VALUES (?,?)', ['disabled_module', 'guild001']),
                                db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['enabled_module', 'guild001', 1]),
                            ])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    afterEach(function () {
        jest.clearAllMocks();
    });
    afterAll(function () {
        jest.restoreAllMocks();
        db.close();
    });
    it('should ignore messages from bots', function () {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = {
                            author: { bot: true },
                            channel: { type: discord_js_1.ChannelType.GuildText }
                        };
                        return [4 /*yield*/, (0, onMessage_1["default"])(message)];
                    case 1:
                        _a.sent();
                        expect(staticModule.onMessage).not.toHaveBeenCalled();
                        expect(disabledModule.onMessage).not.toHaveBeenCalled();
                        expect(enabledModule.onMessage).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should ignore direct messages', function () {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = {
                            author: { bot: false },
                            channel: { type: discord_js_1.ChannelType.DM },
                            cleanContent: 'enabled_module_enabled_command bar baz'
                        };
                        return [4 /*yield*/, (0, onMessage_1["default"])(message)];
                    case 1:
                        _a.sent();
                        expect(staticModule.onMessage).not.toHaveBeenCalled();
                        expect(disabledModule.onMessage).not.toHaveBeenCalled();
                        expect(enabledModule.onMessage).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should pass messages to enabled and static modules', function () {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = {
                            author: { bot: false },
                            channel: {
                                type: discord_js_1.ChannelType.GuildText,
                                guild: { id: 'guild001' }
                            },
                            cleanContent: 'foo bar baz'
                        };
                        return [4 /*yield*/, (0, onMessage_1["default"])(message)];
                    case 1:
                        _a.sent();
                        expect(staticModule.onMessage).toHaveBeenCalledWith(message);
                        expect(disabledModule.onMessage).not.toHaveBeenCalled();
                        expect(enabledModule.onMessage).toHaveBeenCalledWith(message);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should handle the guild not existing in the database', function () {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = {
                            author: { bot: false },
                            channel: {
                                type: discord_js_1.ChannelType.GuildText,
                                guild: { id: 'guild999' }
                            },
                            cleanContent: 'foo bar baz'
                        };
                        return [4 /*yield*/, (0, onMessage_1["default"])(message)];
                    case 1:
                        _a.sent();
                        expect(staticModule.onMessage).not.toHaveBeenCalled();
                        expect(disabledModule.onMessage).not.toHaveBeenCalled();
                        expect(enabledModule.onMessage).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        });
    });
});
