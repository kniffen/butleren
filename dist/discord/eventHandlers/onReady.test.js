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
var addGuildToDatabase_1 = __importDefault(require("../../database/addGuildToDatabase"));
var onReady_1 = __importDefault(require("./onReady"));
jest.mock('../../modules', function () {
    var module001 = {
        commands: [
            {
                isLocked: false,
                data: {
                    name: 'command001',
                    toJSON: function () { return 'command001data'; }
                }
            },
            {
                isLocked: true,
                data: {
                    name: 'command002',
                    toJSON: function () { return 'command002data'; }
                }
            }
        ]
    };
    return [
        module001,
    ];
});
jest.mock('../../database/addGuildToDatabase', function () { return ({
    __esModule: true,
    "default": jest.fn().mockResolvedValue(undefined)
}); });
describe('discord.eventHandlers.onReady()', function () {
    var _this = this;
    var guilds = new discord_js_1.Collection();
    var guildCommands001 = new discord_js_1.Collection();
    var guildCommands002 = new discord_js_1.Collection();
    var client = {
        user: {
            setActivity: jest.fn()
        },
        guilds: {
            fetch: jest.fn().mockImplementation(function (id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, id ? guilds.get(id) : guilds];
            }); }); })
        }
    };
    guilds.set('guild001', {
        id: 'guild001',
        commands: {
            fetch: jest.fn().mockResolvedValue(guildCommands001),
            create: jest.fn().mockResolvedValue(undefined),
            "delete": jest.fn().mockResolvedValue(undefined),
            edit: jest.fn().mockResolvedValue(undefined)
        }
    });
    guilds.set('guild002', {
        id: 'guild002',
        commands: {
            fetch: jest.fn().mockResolvedValue(guildCommands002),
            create: jest.fn().mockResolvedValue(undefined),
            "delete": jest.fn().mockResolvedValue(undefined),
            edit: jest.fn().mockResolvedValue(undefined)
        }
    });
    guildCommands001.set('guildcmd001', { name: 'command001' });
    guildCommands001.set('guildcmd999', { name: 'command999' });
    guildCommands002.set('guildcmd002', { name: 'command002' });
    beforeAll(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log
                            .mockImplementation(function () { return undefined; });
                        return [4 /*yield*/, (0, onReady_1["default"])(client)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    afterAll(function () {
        jest.restoreAllMocks();
    });
    it('should log successful connections', function () {
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith('Discord: Client is ready.');
    });
    it('should set the activity status of the bot', function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(client.user.setActivity).toHaveBeenCalledWith(process.env.npm_package_version);
    });
    it('should add guilds to the database', function () {
        expect(addGuildToDatabase_1["default"]).toHaveBeenCalledWith(guilds.get('guild001'));
        expect(addGuildToDatabase_1["default"]).toHaveBeenCalledWith(guilds.get('guild002'));
    });
    it('should edit commands in case they were updated', function () {
        var _a, _b;
        var guild001Edit = (_a = guilds.get('guild001')) === null || _a === void 0 ? void 0 : _a.commands.edit;
        var guild002Edit = (_b = guilds.get('guild002')) === null || _b === void 0 ? void 0 : _b.commands.edit;
        expect(guild001Edit).toHaveBeenCalledTimes(1);
        expect(guild001Edit).toHaveBeenCalledWith({ name: 'command001' }, 'command001data');
        expect(guild002Edit).toHaveBeenCalledTimes(1);
        expect(guild002Edit).toHaveBeenCalledWith({ name: 'command002' }, 'command002data');
    });
    it('should create new locked commands if they don\'t exist for the guild', function () {
        var _a, _b;
        var guild001Create = (_a = guilds.get('guild001')) === null || _a === void 0 ? void 0 : _a.commands.create;
        var guild002Create = (_b = guilds.get('guild002')) === null || _b === void 0 ? void 0 : _b.commands.create;
        expect(guild001Create).toHaveBeenCalledTimes(1);
        expect(guild001Create).toHaveBeenCalledWith('command002data');
        expect(guild002Create).not.toHaveBeenCalled();
    });
    it('should delete commands that don\'t exist', function () {
        var _a, _b;
        var guild001Delete = (_a = guilds.get('guild001')) === null || _a === void 0 ? void 0 : _a.commands["delete"];
        var guild002Delete = (_b = guilds.get('guild002')) === null || _b === void 0 ? void 0 : _b.commands["delete"];
        expect(guild001Delete).toHaveBeenCalledTimes(1);
        expect(guild001Delete).toHaveBeenCalledWith({ name: 'command999' });
        expect(guild002Delete).not.toHaveBeenCalled();
    });
    it('should handle command edit, create and delete being rejected', function () {
        return __awaiter(this, void 0, void 0, function () {
            var guild001;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        guild001 = guilds.get('guild001');
                        (guild001 === null || guild001 === void 0 ? void 0 : guild001.commands.create).mockRejectedValue('Guild001 commands create error');
                        (guild001 === null || guild001 === void 0 ? void 0 : guild001.commands.edit).mockRejectedValue('Guild001 commands edit error');
                        (guild001 === null || guild001 === void 0 ? void 0 : guild001.commands["delete"]).mockRejectedValue('Guild001 commands delete error');
                        return [4 /*yield*/, (0, onReady_1["default"])(client)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 100); })];
                    case 2:
                        _a.sent(); // Not ideal, but it works
                        expect(console.error).toHaveBeenCalledTimes(3);
                        expect(console.error).toHaveBeenNthCalledWith(1, 'Guild001 commands edit error');
                        expect(console.error).toHaveBeenNthCalledWith(2, 'Guild001 commands create error');
                        expect(console.error).toHaveBeenNthCalledWith(3, 'Guild001 commands delete error');
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should handle guilds fetch being rejected', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client.guilds.fetch.mockRejectedValue('Guilds fetch error');
                        return [4 /*yield*/, (0, onReady_1["default"])(client)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    it.todo('should handle guild commands fetch being rejected');
});
