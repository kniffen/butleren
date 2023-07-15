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
exports.weatherCommand = exports.execute = exports.data = void 0;
var discord_js_1 = __importDefault(require("discord.js"));
var builders_1 = require("@discordjs/builders");
var node_fetch_1 = __importDefault(require("node-fetch"));
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var database_1 = __importDefault(require("../../../database"));
exports.data = new builders_1.SlashCommandBuilder()
    .setName('weather')
    .setDescription('Get a weather report for a location')
    .addStringOption(function (option) { return option.setName('location').setDescription('Location name or zip code'); })
    .addUserOption(function (option) { return option.setName('user').setDescription('A user'); });
var windDirections = [
    'North',
    'Northeast',
    'East',
    'Southeast',
    'South',
    'Southwest',
    'West',
    'Northwest'
];
function execute(interaction) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __awaiter(this, void 0, void 0, function () {
        var db, settings, user, query, location_1, _l, zip, uri, data_1, embed, date, isAprilFools, precips, precip, midRad, maxRad, radiation, err_1;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    _m.trys.push([0, 8, , 9]);
                    if (!interaction.guild)
                        return [2 /*return*/];
                    return [4 /*yield*/, interaction.deferReply()];
                case 1:
                    _m.sent();
                    return [4 /*yield*/, database_1["default"]];
                case 2:
                    db = _m.sent();
                    return [4 /*yield*/, db.get('SELECT color FROM guilds WHERE id = ?', [interaction.guild.id])];
                case 3:
                    settings = _m.sent();
                    user = ((_a = interaction.options.get('user')) === null || _a === void 0 ? void 0 : _a.user) || interaction.user;
                    query = (_b = interaction.options.get('location')) === null || _b === void 0 ? void 0 : _b.value;
                    if (!!query) return [3 /*break*/, 5];
                    return [4 /*yield*/, db.get('SELECT location FROM users WHERE id = ?', [user.id])];
                case 4:
                    _l = (_c = (_m.sent())) === null || _c === void 0 ? void 0 : _c.location;
                    return [3 /*break*/, 6];
                case 5:
                    _l = null;
                    _m.label = 6;
                case 6:
                    location_1 = _l;
                    if (!query && !location_1) {
                        interaction.editReply({
                            content: 'Missing location'
                        });
                        return [2 /*return*/];
                    }
                    zip = parseInt(query || location_1) || null;
                    uri = zip
                        ? "https://api.openweathermap.org/data/2.5/weather?zip=".concat(encodeURIComponent(zip), "&units=metric&APPID=").concat(process.env.OPEN_WEATHER_MAP_API_KEY)
                        : "https://api.openweathermap.org/data/2.5/weather?q=".concat(encodeURIComponent(query || location_1), "&units=metric&APPID=").concat(process.env.OPEN_WEATHER_MAP_API_KEY);
                    return [4 /*yield*/, (0, node_fetch_1["default"])(uri).then(function (res) { return res.json(); })];
                case 7:
                    data_1 = _m.sent();
                    embed = new discord_js_1["default"].EmbedBuilder();
                    date = moment_timezone_1["default"].utc((data_1.dt + data_1.timezone) * 1000);
                    isAprilFools = '1Apr' === date.format('DMMM');
                    precips = [
                        { type: 'rain', time: '1h', amount: (_d = data_1.rain) === null || _d === void 0 ? void 0 : _d['1h'] },
                        { type: 'rain', time: '3h', amount: (_e = data_1.rain) === null || _e === void 0 ? void 0 : _e['3h'] },
                        { type: 'snow', time: '1h', amount: (_f = data_1.snow) === null || _f === void 0 ? void 0 : _f['1h'] },
                        { type: 'snow', time: '3h', amount: (_g = data_1.snow) === null || _g === void 0 ? void 0 : _g['3h'] },
                    ];
                    precip = precips.find(function (precip) { return precip.amount; });
                    embed.setColor(settings.color);
                    embed.setAuthor({
                        name: "Weather report for ".concat(location_1 ? user.username : "".concat(data_1.name, " (").concat(data_1.sys.country, ")")),
                        iconURL: isAprilFools
                            ? 'http://openweathermap.org/img/wn/02d.png'
                            : "http://openweathermap.org/img/wn/".concat((_h = data_1.weather) === null || _h === void 0 ? void 0 : _h[0].icon, ".png")
                    });
                    if (isAprilFools) {
                        midRad = 200;
                        maxRad = 2000;
                        radiation = Math.random() * (maxRad - midRad) + midRad;
                        embed.addFields({
                            name: date.add(1000, 'year').format('LLL'),
                            value: 'Hot and cloudy'
                        }, {
                            name: '🌬️ Zephyr',
                            value: "".concat((data_1.wind.speed * 1000).toFixed(1), " sec/km\n") +
                                "".concat((data_1.wind.speed * 39370.1).toFixed(1), " thou/sec\n") +
                                "".concat(windDirections[Math.floor(data_1.wind.deg % 360 / (360 / windDirections.length))]),
                            inline: true
                        }, {
                            name: '☔ Acid deposition',
                            value: "".concat((precip === null || precip === void 0 ? void 0 : precip.amount) * 1000000 || '0.00', " \u00B5m\n").concat(precip ? (precip.amount * 39.3701).toFixed(2) : '0.00', " thou"),
                            inline: true
                        }, {
                            name: '☢️ Radiation',
                            value: "".concat(radiation.toFixed(), " nSv/h\n").concat((radiation * 10000).toFixed().toLocaleString(), " mR/h"),
                            inline: true
                        }, {
                            name: '🌆 Natural light',
                            value: moment_timezone_1["default"].utc((data_1.sys.sunrise + data_1.timezone) * 1000).format('HH:mm:ss'),
                            inline: true
                        }, {
                            name: '💡 Illumination',
                            value: moment_timezone_1["default"].utc((data_1.sys.sunset + data_1.timezone) * 1000).format('HH:mm:ss'),
                            inline: true
                        }, {
                            name: '🫧 Carbon dioxide',
                            value: "".concat(data_1.main.humidity, "%"),
                            inline: true
                        });
                        embed.setFooter({ text: 'Weather report provided by the Union Aerospace Corporation' });
                    }
                    else {
                        embed.addFields({
                            name: date.format('LLL'),
                            value: "".concat((_j = data_1.weather) === null || _j === void 0 ? void 0 : _j[0].main, " (").concat((_k = data_1.weather) === null || _k === void 0 ? void 0 : _k[0].description, ")")
                        }, {
                            name: '💨 Wind',
                            value: "".concat(data_1.wind.speed.toFixed(1), "m/s\n") +
                                "".concat((data_1.wind.speed * 2.23694).toFixed(1), "mph\n") +
                                "".concat(windDirections[Math.floor(data_1.wind.deg % 360 / (360 / windDirections.length))]),
                            inline: true
                        }, {
                            name: "".concat('snow' === (precip === null || precip === void 0 ? void 0 : precip.type) ? '🌨️ Snow' : '🌧️ Rain', " (").concat((precip === null || precip === void 0 ? void 0 : precip.time) || '3h', ")"),
                            value: "".concat((precip === null || precip === void 0 ? void 0 : precip.amount) || '0.00', "mm\n").concat(precip ? (precip.amount * 0.0393701).toFixed(2) : '0.00', "inch"),
                            inline: true
                        }, {
                            name: '🌡️ Temp | Feels like',
                            value: "".concat(Math.round(data_1.main.temp), "\u00B0C | ").concat(Math.round(data_1.main.feels_like), "\u00B0C\n") +
                                "".concat(Math.round(data_1.main.temp * 1.8 + 32), "\u00B0F | ").concat(Math.round(data_1.main.feels_like * 1.8 + 32), "\u00B0F"),
                            inline: true
                        }, {
                            name: '🌅 Sunrise',
                            value: moment_timezone_1["default"].utc((data_1.sys.sunrise + data_1.timezone) * 1000).format('LT'),
                            inline: true
                        }, {
                            name: '🌇 Sunset',
                            value: moment_timezone_1["default"].utc((data_1.sys.sunset + data_1.timezone) * 1000).format('LT'),
                            inline: true
                        }, {
                            name: '💦 Humidity',
                            value: "".concat(data_1.main.humidity, "%"),
                            inline: true
                        });
                        embed.setFooter({ text: 'Weather report provided by OpenWeather' });
                    }
                    interaction.editReply({
                        embeds: [embed]
                    });
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _m.sent();
                    console.error(err_1);
                    interaction.editReply({
                        content: 'Sorry, I was unable to fetch a weather report for you'
                    });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.execute = execute;
exports.weatherCommand = {
    isLocked: true,
    data: exports.data,
    execute: execute
};
