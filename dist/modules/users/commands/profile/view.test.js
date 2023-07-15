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
var database_1 = __importDefault(require("../../../../database"));
var view_js_1 = __importDefault(require("./view.js"));
describe('modules.users.commands.profile.view', function () {
    var db = null;
    var interactions = [
        {
            user: {
                id: 'user001',
                username: 'username001',
                discriminator: '1234',
                displayAvatarURL: function () { return 'https://avatar.url'; }
            },
            reply: jest.fn()
        },
        {
            user: {
                id: 'user002',
                username: 'username002',
                discriminator: '5678',
                displayAvatarURL: function () { return 'https://avatar.url'; }
            },
            reply: jest.fn()
        }
    ];
    function createExpectedEmbed(interaction) {
        var expectedEmbed = new discord_js_1["default"].EmbedBuilder();
        expectedEmbed.setAuthor({ name: "Profile for ".concat(interaction.user.username) });
        expectedEmbed.setThumbnail(interaction.user.displayAvatarURL());
        expectedEmbed.setColor('#19D8B4');
        expectedEmbed.addFields({ name: 'ID', value: interaction.user.id, inline: true }, { name: 'Username', value: interaction.user.username, inline: true }, { name: 'Discriminator', value: interaction.user.discriminator, inline: true });
        return expectedEmbed;
    }
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
                        return [4 /*yield*/, db.run('INSERT INTO users (id, location) VALUES (?,?)', ['user002', 'location002'])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    beforeEach(function () {
        jest.clearAllMocks();
    });
    it('should respond with an embed of the user\'s profile', function () {
        return __awaiter(this, void 0, void 0, function () {
            var expectedEmbeds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedEmbeds = interactions.map(function (interaction) { return createExpectedEmbed(interaction); });
                        expectedEmbeds[1].addFields({ name: 'Location', value: 'location002' });
                        return [4 /*yield*/, (0, view_js_1["default"])(interactions[0])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, view_js_1["default"])(interactions[1])];
                    case 2:
                        _a.sent();
                        expect(interactions[0].reply).toHaveBeenCalledWith({
                            embeds: [expectedEmbeds[0]],
                            ephemeral: true
                        });
                        expect(interactions[1].reply).toHaveBeenCalledWith({
                            embeds: [expectedEmbeds[1]],
                            ephemeral: true
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should handle reading from the database being rejected', function () {
        return __awaiter(this, void 0, void 0, function () {
            var expectedEmbed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jest.spyOn(db, 'get').mockRejectedValue('Error message');
                        expectedEmbed = createExpectedEmbed(interactions[1]);
                        return [4 /*yield*/, (0, view_js_1["default"])(interactions[1])];
                    case 1:
                        _a.sent();
                        expect(console.error).toHaveBeenCalledWith('Error message');
                        expect(interactions[1].reply).toHaveBeenCalledWith({
                            embeds: [expectedEmbed],
                            ephemeral: true
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
});
