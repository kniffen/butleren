"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var node_fetch_1 = __importDefault(require("node-fetch"));
var database_1 = __importDefault(require("../../../database"));
var command = __importStar(require("./weather.js"));
describe('modules.weather.commands.weather', function () {
    var db;
    var interaction;
    var expectedEmbed;
    var weatherData;
    var fetchMock = node_fetch_1["default"];
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
                        return [4 /*yield*/, db.run('INSERT INTO guilds (id) VALUES (?)', ['guild001'])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO users (id, location) VALUES (?,?)', ['user001', 'location001'])];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, db.run('INSERT INTO users (id, location) VALUES (?,?)', ['user002', 'location002'])];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    beforeEach(function () {
        var _this = this;
        jest.clearAllMocks();
        fetchMock.mockImplementation(function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, ({
                        json: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, weatherData];
                        }); }); }
                    })];
            });
        }); });
        weatherData = {
            name: 'weather_name',
            dt: 10000,
            timezone: 500,
            sys: {
                country: 'weather_country',
                sunrise: 20000,
                sunset: 30000
            },
            weather: [{
                    main: 'weather_weather_main',
                    icon: 'weather_weather_icon',
                    description: 'weather_weather_description'
                }],
            wind: {
                speed: 12.34,
                deg: 45
            },
            rain: {
                '1h': 55
            },
            main: {
                temp: 65,
                feels_like: 66,
                humidity: 50
            }
        };
        interaction = {
            guild: {
                id: 'guild001'
            },
            user: {
                id: 'user001',
                username: 'username001'
            },
            options: new discord_js_1["default"].Collection(),
            deferReply: jest.fn(),
            editReply: jest.fn()
        };
        expectedEmbed = new discord_js_1["default"].EmbedBuilder();
        expectedEmbed.setColor('#19D8B4');
        expectedEmbed.setAuthor({ name: 'Weather report for username001', iconURL: 'http://openweathermap.org/img/wn/weather_weather_icon.png' });
        expectedEmbed.setFooter({ text: 'Weather report provided by OpenWeather' });
        expectedEmbed.addFields({
            name: 'January 1, 1970 2:55 AM',
            value: 'weather_weather_main (weather_weather_description)'
        }, {
            name: '💨 Wind',
            value: '12.3m/s\n27.6mph\nNortheast',
            inline: true
        }, {
            name: '🌧️ Rain (1h)',
            value: '55mm\n2.17inch',
            inline: true
        }, {
            name: '🌡️ Temp | Feels like',
            value: '65°C | 66°C\n149°F | 151°F',
            inline: true
        }, {
            name: '🌅 Sunrise',
            value: '5:41 AM',
            inline: true
        }, {
            name: '🌇 Sunset',
            value: '8:28 AM',
            inline: true
        }, {
            name: '💦 Humidity',
            value: '50%',
            inline: true
        });
    });
    it('should contain certain properties', function () {
        expect(command).toEqual({
            data: {
                name: 'weather',
                description: 'Get a weather report for a location',
                options: [
                    {
                        description: 'Location name or zip code',
                        name: 'location',
                        required: false,
                        type: 3
                    },
                    {
                        description: 'A user',
                        name: 'user',
                        required: false,
                        type: 6
                    }
                ]
            },
            isLocked: false,
            execute: expect.anything()
        });
    });
    it('should fetch a weather report for the user', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, command.execute(interaction)];
                    case 1:
                        _a.sent();
                        expect(interaction.deferReply).toHaveBeenCalled();
                        expect(fetchMock).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather?q=location001&units=metric&APPID=open_weather_map_api_key');
                        expect(interaction.editReply).toHaveBeenCalledWith({
                            embeds: [expectedEmbed]
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should output a special weather report on april foold', function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchMock.mockImplementation(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        json: function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, (__assign(__assign({}, weatherData), { dt: 1680307200 }))];
                                            });
                                        }); }
                                    })];
                            });
                        }); });
                        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
                        expectedEmbed = new discord_js_1["default"].EmbedBuilder();
                        expectedEmbed.setColor('#19D8B4');
                        expectedEmbed.setAuthor({ name: 'Weather report for username001', iconURL: 'http://openweathermap.org/img/wn/02d.png' });
                        expectedEmbed.setFooter({ text: 'Weather report provided by the Union Aerospace Corporation' });
                        expectedEmbed.addFields([
                            {
                                name: 'April 1, 3023 12:08 AM',
                                value: 'Hot and cloudy'
                            },
                            {
                                inline: true,
                                name: '🌬️ Zephyr',
                                value: '12340.0 sec/km\n485827.0 thou/sec\nNortheast'
                            },
                            {
                                inline: true,
                                name: '☔ Acid deposition',
                                value: '55000000 µm\n2165.36 thou'
                            },
                            {
                                inline: true,
                                name: '☢️ Radiation',
                                value: '1100 nSv/h\n11000000 mR/h'
                            },
                            {
                                inline: true,
                                name: '🌆 Natural light',
                                value: '05:41:40'
                            },
                            {
                                inline: true,
                                name: '💡 Illumination',
                                value: '08:28:20'
                            },
                            {
                                inline: true,
                                name: '🫧 Carbon dioxide',
                                value: '50%'
                            },
                        ]);
                        return [4 /*yield*/, command.execute(interaction)];
                    case 1:
                        _a.sent();
                        expect(interaction.editReply).toHaveBeenCalledWith({
                            embeds: [expectedEmbed]
                        });
                        Math.random.mockRestore();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should handle there being no rain data', function () {
        return __awaiter(this, void 0, void 0, function () {
            var rainField;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchMock.mockImplementation(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        json: function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, (__assign(__assign({}, weatherData), { rain: undefined }))];
                                            });
                                        }); }
                                    })];
                            });
                        }); });
                        expectedEmbed.data;
                        rainField = expectedEmbed.data.fields.find(function (field) { return '🌧️ Rain (1h)' === field.name; });
                        rainField.name = '🌧️ Rain (3h)';
                        rainField.value = '0.00mm\n0.00inch';
                        return [4 /*yield*/, command.execute(interaction)];
                    case 1:
                        _a.sent();
                        expect(interaction.deferReply).toHaveBeenCalled();
                        expect(interaction.editReply).toHaveBeenCalledWith({
                            embeds: [expectedEmbed]
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should handle there being snow data', function () {
        return __awaiter(this, void 0, void 0, function () {
            var rainField;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchMock.mockImplementation(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        json: function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, (__assign(__assign({}, weatherData), { rain: undefined, snow: { '1h': 555 } }))];
                                            });
                                        }); }
                                    })];
                            });
                        }); });
                        rainField = expectedEmbed.data.fields.find(function (field) { return '🌧️ Rain (1h)' === field.name; });
                        rainField.name = '🌨️ Snow (1h)';
                        rainField.value = '555mm\n21.85inch';
                        return [4 /*yield*/, command.execute(interaction)];
                    case 1:
                        _a.sent();
                        expect(interaction.deferReply).toHaveBeenCalled();
                        expect(interaction.editReply).toHaveBeenCalledWith({
                            embeds: [expectedEmbed]
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should fetch a weather report for a targeted user', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        interaction.options.set('user', {
                            user: {
                                id: 'user002',
                                username: 'username002'
                            }
                        });
                        expectedEmbed.setAuthor({
                            name: 'Weather report for username002',
                            iconURL: 'http://openweathermap.org/img/wn/weather_weather_icon.png'
                        });
                        return [4 /*yield*/, command.execute(interaction)];
                    case 1:
                        _a.sent();
                        expect(interaction.deferReply).toHaveBeenCalled();
                        expect(fetchMock).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather?q=location002&units=metric&APPID=open_weather_map_api_key');
                        expect(interaction.editReply).toHaveBeenCalledWith({
                            embeds: [expectedEmbed]
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should fetch a weather report for a location', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        interaction.options.set('location', { value: 'location999' });
                        expectedEmbed.setAuthor({
                            name: 'Weather report for weather_name (weather_country)',
                            iconURL: 'http://openweathermap.org/img/wn/weather_weather_icon.png'
                        });
                        return [4 /*yield*/, command.execute(interaction)];
                    case 1:
                        _a.sent();
                        expect(interaction.deferReply).toHaveBeenCalled();
                        expect(fetchMock).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather?q=location999&units=metric&APPID=open_weather_map_api_key');
                        expect(interaction.editReply).toHaveBeenCalledWith({
                            embeds: [expectedEmbed]
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should fetch a weather report for a zip code', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        interaction.options.set('location', { value: '1234' });
                        expectedEmbed.setAuthor({
                            name: 'Weather report for weather_name (weather_country)',
                            iconURL: 'http://openweathermap.org/img/wn/weather_weather_icon.png'
                        });
                        return [4 /*yield*/, command.execute(interaction)];
                    case 1:
                        _a.sent();
                        expect(interaction.deferReply).toHaveBeenCalled();
                        expect(fetchMock).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather?zip=1234&units=metric&APPID=open_weather_map_api_key');
                        expect(interaction.editReply).toHaveBeenCalledWith({
                            embeds: [expectedEmbed]
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should handle the user not having a location stored in the database', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        interaction.user.id = 'user999';
                        return [4 /*yield*/, command.execute(interaction)];
                    case 1:
                        _a.sent();
                        expect(interaction.deferReply).toHaveBeenCalled();
                        expect(fetchMock).not.toHaveBeenCalled();
                        expect(interaction.editReply).toHaveBeenCalledWith({
                            content: 'Missing location',
                            ephemeral: true
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should handle the location not existing', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchMock.mockRejectedValue('Error message');
                        return [4 /*yield*/, command.execute(interaction)];
                    case 1:
                        _a.sent();
                        expect(interaction.deferReply).toHaveBeenCalled();
                        expect(console.error).toHaveBeenCalledWith('Error message');
                        expect(interaction.editReply).toHaveBeenCalledWith({
                            content: 'Sorry, I was unable to fetch a weather report for you',
                            ephemeral: true
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
});
