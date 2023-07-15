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
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var fetchTwitchUsers_1 = __importDefault(require("../../utils/fetchTwitchUsers"));
var fetchTwitchSchedule_1 = __importDefault(require("../../utils/fetchTwitchSchedule"));
function schedule(interaction) {
    return __awaiter(this, void 0, void 0, function () {
        var channel, username, user, schedule_1, embed, fields, i, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, interaction.deferReply()];
                case 1:
                    _a.sent();
                    channel = interaction.options.get('channel');
                    username = 'string' === typeof (channel === null || channel === void 0 ? void 0 : channel.value) && channel.value.split(' ').shift();
                    if (!username)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, fetchTwitchUsers_1["default"])({ ids: [], usernames: [username.toLowerCase()] })];
                case 2:
                    user = (_a.sent())[0];
                    if (!user)
                        return [2 /*return*/, interaction.editReply({
                                content: "Sorry, i was unable to find \"".concat(username, "\" on twitch :(")
                            })];
                    return [4 /*yield*/, (0, fetchTwitchSchedule_1["default"])({ id: user.id })];
                case 3:
                    schedule_1 = _a.sent();
                    embed = new discord_js_1["default"].EmbedBuilder();
                    if (1 > schedule_1.length)
                        return [2 /*return*/, interaction.editReply({
                                content: "".concat(user.display_name, " does not appear to have a schedule configured")
                            })];
                    embed.setTitle("Stream schedule for ".concat(user.display_name));
                    embed.setURL("https://twitch.tv/".concat(user.login, "/schedule"));
                    embed.setColor('#9146FF'); // Twitch purple
                    embed.setThumbnail(user.profile_image_url);
                    embed.setFooter({ text: 'Times are in your local timezone' });
                    fields = [];
                    for (i = 0; 3 > i && i < schedule_1.length; i++) {
                        fields.push({
                            name: "<t:".concat((0, moment_timezone_1["default"])(schedule_1[i].start_time).format('X'), ">"),
                            value: "".concat(schedule_1[i].title || 'Untitled').concat(schedule_1[i].category ? " (".concat(schedule_1[i].category.name, ")") : '')
                        });
                    }
                    embed.addFields.apply(embed, fields);
                    interaction.editReply({ embeds: [embed] });
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.error(err_1);
                    interaction.editReply({
                        content: 'Something went horribly wrong'
                    });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = schedule;
