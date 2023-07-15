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
var database_1 = __importDefault(require("../../../../database"));
function testLocation(location) {
    return __awaiter(this, void 0, void 0, function () {
        var zip, uri, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    zip = parseInt(location) || null;
                    uri = zip
                        ? "https://api.openweathermap.org/data/2.5/weather?zip=".concat(encodeURIComponent(zip), "&units=metric&APPID=").concat(process.env.OPEN_WEATHER_MAP_API_KEY)
                        : "https://api.openweathermap.org/data/2.5/weather?q=".concat(encodeURIComponent(location), "&units=metric&APPID=").concat(process.env.OPEN_WEATHER_MAP_API_KEY);
                    return [4 /*yield*/, (0, node_fetch_1["default"])(uri)["catch"](function () { return null; })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res === null || res === void 0 ? void 0 : res.ok];
            }
        });
    });
}
function setLocation(interaction) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var content, db, userData, location_1, _c, err_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    content = 'Sorry, I was unable to set your location.';
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 7, 8, 9]);
                    return [4 /*yield*/, database_1["default"]];
                case 2:
                    db = _d.sent();
                    return [4 /*yield*/, db.get('SELECT location FROM users WHERE id = ?', [interaction.user.id])];
                case 3:
                    userData = _d.sent();
                    location_1 = (_b = (_a = interaction.options.get('location')) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.toString();
                    _c = !location_1;
                    if (_c) return [3 /*break*/, 5];
                    return [4 /*yield*/, testLocation(location_1)];
                case 4:
                    _c = !(_d.sent());
                    _d.label = 5;
                case 5:
                    if (_c) {
                        content = 'Sorry, I was unable to verify that location.';
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, db.run(!userData
                            ? 'INSERT INTO users (location, id) VALUES (?,?)'
                            : 'UPDATE users SET location = ? WHERE id = ?', [location_1, interaction.user.id])];
                case 6:
                    _d.sent();
                    content = "Your location is now set to `".concat(location_1, "`\nType `/profile` to view your updated profile.");
                    return [3 /*break*/, 9];
                case 7:
                    err_1 = _d.sent();
                    console.error(err_1);
                    return [3 /*break*/, 9];
                case 8:
                    interaction.reply({ content: content, ephemeral: true });
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = setLocation;
