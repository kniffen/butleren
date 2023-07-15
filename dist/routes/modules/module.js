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
var database_1 = __importDefault(require("../../database"));
var client_1 = __importDefault(require("../../discord/client"));
var router_1 = __importDefault(require("./router"));
var modules_1 = require("../../modules");
router_1["default"].get('/:guild/:module', function getModule(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var handleError, guild, mod, db, entry, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handleError = function (err) { return console.error(req.method, req.originalUrl, err); };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, client_1["default"].guilds.fetch(req.params.guild)["catch"](handleError)];
                case 2:
                    guild = _a.sent();
                    if (!guild)
                        return [2 /*return*/, res.sendStatus(404)];
                    mod = Object.values(modules_1.modules).find(function (mod) { return mod.id === req.params.module; });
                    if (!mod)
                        return [2 /*return*/, res.sendStatus(404)];
                    return [4 /*yield*/, database_1["default"]];
                case 3:
                    db = _a.sent();
                    return [4 /*yield*/, db.get('SELECT isEnabled FROM modules WHERE id = ? AND guildId = ?', [mod.id, guild.id])["catch"](handleError)];
                case 4:
                    entry = _a.sent();
                    data = {
                        id: mod.id,
                        name: mod.name,
                        description: mod.description,
                        isEnabled: !!(!entry || entry.isEnabled),
                        isLocked: !entry
                    };
                    res.send(data);
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    if (err_1 instanceof Error)
                        handleError(err_1);
                    res.sendStatus(500);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
router_1["default"].put('/:guild/:module', function putModule(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var handleError, guild_1, db, settings, mod, moduleCommands_1, guildCommands, entries, sqlStr, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handleError = function (err) { return console.error(req.method, req.originalUrl, err); };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 11, , 12]);
                    return [4 /*yield*/, client_1["default"].guilds.fetch(req.params.guild)["catch"](handleError)];
                case 2:
                    guild_1 = _a.sent();
                    if (!guild_1)
                        return [2 /*return*/, res.sendStatus(404)];
                    return [4 /*yield*/, database_1["default"]];
                case 3:
                    db = _a.sent();
                    return [4 /*yield*/, db.get('SELECT * FROM modules WHERE guildId = ? AND id = ?', [req.params.guild, req.params.module])];
                case 4:
                    settings = _a.sent();
                    if (!settings)
                        return [2 /*return*/, res.sendStatus(404)];
                    if (!('isEnabled' in req.body)) return [3 /*break*/, 9];
                    mod = Object.values(modules_1.modules).find(function (mod) { return mod.id === req.params.module; });
                    if (!mod)
                        return [2 /*return*/, res.sendStatus(404)];
                    moduleCommands_1 = mod.commands ? Object.values(mod.commands) : [];
                    return [4 /*yield*/, guild_1.commands.fetch()
                            .then(function (gc) { return gc.filter(function (gc) { return moduleCommands_1.find(function (c) { return gc.name === c.data.name; }); }); })["catch"](handleError)];
                case 5:
                    guildCommands = _a.sent();
                    if (!guildCommands)
                        return [2 /*return*/, res.sendStatus(500)];
                    if (!!req.body.isEnabled) return [3 /*break*/, 7];
                    return [4 /*yield*/, Promise.all(guildCommands.map(function (cmd) { return guild_1.commands["delete"](cmd); }))];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, Promise.all(moduleCommands_1
                        .map(function (cmd) { return cmd.data.toJSON && guild_1.commands.create(cmd.data.toJSON()); }))];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9:
                    entries = Object.entries(req.body).filter(function (_a) {
                        var key = _a[0];
                        return !['id', 'guildId'].includes(key);
                    });
                    sqlStr = "UPDATE modules\n      ".concat(entries.map(function (_a) {
                        var key = _a[0], value = _a[1];
                        return "SET ".concat(key, " = ").concat('string' === typeof value ? "\"".concat(value, "\"") : value);
                    }).join(','), "\n      WHERE guildId = ? AND id = ?");
                    return [4 /*yield*/, db.run(sqlStr, [req.params.guild, req.params.module])];
                case 10:
                    _a.sent();
                    res.sendStatus(200);
                    return [3 /*break*/, 12];
                case 11:
                    err_2 = _a.sent();
                    if (err_2 instanceof Error)
                        handleError(err_2);
                    res.sendStatus(500);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
});
