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
var database_1 = __importDefault(require("../../../database"));
var utils_1 = require("../utils");
router_1["default"].get('/:guild/shows', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var db, entries_1, showIds, shows, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, database_1["default"]];
                case 1:
                    db = _a.sent();
                    return [4 /*yield*/, db.all('SELECT id, notificationChannelId, notificationRoleId FROM spotifyShows WHERE guildId = ?', [req.params.guild])];
                case 2:
                    entries_1 = _a.sent();
                    showIds = entries_1.reduce(function (ids, entry) { return ids.includes(entry.id) ? ids : __spreadArray(__spreadArray([], ids, true), [entry.id], false); }, []);
                    return [4 /*yield*/, (0, utils_1.fetchSpotifyShows)(showIds)];
                case 3:
                    shows = _a.sent();
                    return [2 /*return*/, res.send(shows.map(function (show) {
                            var entry = entries_1.find(function (_a) {
                                var id = _a.id;
                                return id === show.id;
                            });
                            return __assign({ id: show.id, name: show.name, publisher: show.publisher, description: show.description, url: show.external_urls.spotify }, entry);
                        }))];
                case 4:
                    err_1 = _a.sent();
                    console.error(req.method, req.originalUrl, err_1);
                    res.sendStatus(500);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
router_1["default"].post('/:guild/shows', function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var db, existingEntry, episodes, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    if (!req.body.id ||
                        !req.body.notificationChannelId ||
                        !req.body.notificationRoleId) {
                        return [2 /*return*/, res.sendStatus(400)];
                    }
                    return [4 /*yield*/, database_1["default"]];
                case 1:
                    db = _b.sent();
                    return [4 /*yield*/, db.get('SELECT * FROM spotifyShows WHERE guildId = ? AND id = ?', [req.params.guild, req.body.id])];
                case 2:
                    existingEntry = _b.sent();
                    if (existingEntry)
                        return [2 /*return*/, res.sendStatus(409)];
                    return [4 /*yield*/, (0, utils_1.fetchSpotifyShowEpisodes)(req.body.id)];
                case 3:
                    episodes = _b.sent();
                    return [4 /*yield*/, db.run('INSERT INTO spotifyShows (guildId, id, latestEpisodeId, notificationChannelId, notificationRoleId) VALUES (?,?,?,?,?)', [req.params.guild, req.body.id, ((_a = episodes[0]) === null || _a === void 0 ? void 0 : _a.id) || null, req.body.notificationChannelId, req.body.notificationRoleId])];
                case 4:
                    _b.sent();
                    res.sendStatus(201);
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _b.sent();
                    console.error(req.method, req.originalUrl, err_2);
                    res.sendStatus(500);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
router_1["default"].patch('/:guild/shows', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var db, entry, sql, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, database_1["default"]];
                case 1:
                    db = _a.sent();
                    return [4 /*yield*/, db.get('SELECT * FROM spotifyShows WHERE guildId = ? AND id = ?', [req.params.guild, req.body.id])];
                case 2:
                    entry = _a.sent();
                    if (!entry)
                        return [2 /*return*/, res.sendStatus(404)];
                    sql = "UPDATE spotifyShows\n       SET notificationChannelId = ?, notificationRoleId = ?\n       WHERE id = ? AND guildId = ?";
                    return [4 /*yield*/, db.run(sql, [
                            req.body.notificationChannelId || null,
                            req.body.notificationRoleId || null,
                            req.body.id,
                            req.params.guild
                        ])];
                case 3:
                    _a.sent();
                    res.sendStatus(200);
                    return [3 /*break*/, 5];
                case 4:
                    err_3 = _a.sent();
                    console.error(req.method, req.originalUrl, err_3);
                    res.sendStatus(500);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
router_1["default"]["delete"]('/:guild/shows', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var db, entry, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, database_1["default"]];
                case 1:
                    db = _a.sent();
                    return [4 /*yield*/, db.get('SELECT * FROM spotifyShows WHERE guildId = ? AND id = ?', [req.params.guild, req.body.id])];
                case 2:
                    entry = _a.sent();
                    if (!entry)
                        return [2 /*return*/, res.sendStatus(404)];
                    return [4 /*yield*/, db.run('DELETE FROM spotifyShows WHERE guildId = ? AND id = ?', [req.params.guild, req.body.id])];
                case 3:
                    _a.sent();
                    res.sendStatus(200);
                    return [3 /*break*/, 5];
                case 4:
                    err_4 = _a.sent();
                    console.error(req.method, req.originalUrl, err_4);
                    res.sendStatus(500);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
