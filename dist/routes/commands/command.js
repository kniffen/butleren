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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var router_1 = __importDefault(require("./router"));
var database_1 = __importDefault(require("../../database"));
var client_1 = __importDefault(require("../../discord/client"));
var modules_1 = require("../../modules");
router_1["default"].put('/:guild/:module/:command', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var handleError, guild_1, commands, command_1, guildCommands, guildCommand, db_1, applicationCommand, err_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handleError = function (err) { return console.error(req.method, req.originalUrl, err); };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    if (!('isEnabled' in req.body))
                        return [2 /*return*/, res.sendStatus(400)];
                    return [4 /*yield*/, client_1["default"].guilds.fetch(req.params.guild)["catch"](handleError)];
                case 2:
                    guild_1 = _a.sent();
                    commands = modules_1.modules.reduce(function (commands, mod) {
                        if (!mod.commands)
                            return commands;
                        return __spreadArray(__spreadArray([], commands, true), mod.commands.map(function (cmd) { return (__assign(__assign({}, cmd), { mod: mod })); }), true);
                    }, []);
                    command_1 = commands.find(function (cmd) { return cmd.data.name === req.params.command; });
                    if (!guild_1 || !command_1)
                        return [2 /*return*/, res.sendStatus(404)];
                    if (!command_1.data.toJSON)
                        return [2 /*return*/, res.sendStatus(500)];
                    return [4 /*yield*/, guild_1.commands.fetch()];
                case 3:
                    guildCommands = _a.sent();
                    if (!!req.body.isEnabled) return [3 /*break*/, 4];
                    guildCommand = guildCommands.find(function (guildCmd) { return guildCmd.name === command_1.data.name; });
                    if (!guildCommand)
                        return [2 /*return*/, res.sendStatus(404)];
                    guild_1.commands["delete"](guildCommand)
                        .then(function () { return res.sendStatus(200); });
                    return [3 /*break*/, 8];
                case 4: return [4 /*yield*/, database_1["default"]];
                case 5:
                    db_1 = _a.sent();
                    // Here we enable the module if it's disabled
                    return [4 /*yield*/, db_1.get('SELECT isEnabled FROM modules WHERE id = ? AND guildId = ?', [command_1.mod.id, guild_1.id]).then(function (modSettings) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!!modSettings.isEnabled) return [3 /*break*/, 2];
                                        return [4 /*yield*/, db_1.run('UPDATE modules SET isEnabled = 1 WHERE id = ? AND guildId = ?', [command_1.mod.id, guild_1.id])];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 6:
                    // Here we enable the module if it's disabled
                    _a.sent();
                    return [4 /*yield*/, guild_1.commands.create(command_1.data.toJSON())["catch"](handleError)];
                case 7:
                    applicationCommand = _a.sent();
                    if (!applicationCommand)
                        return [2 /*return*/, res.sendStatus(500)];
                    res.sendStatus(200);
                    _a.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    err_1 = _a.sent();
                    if (err_1 instanceof Error)
                        handleError(err_1);
                    res.sendStatus(500);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
});
