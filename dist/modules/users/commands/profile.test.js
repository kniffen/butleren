"use strict";
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
var command = __importStar(require("./profile.js"));
var view_js_1 = __importDefault(require("./profile/view.js"));
var delete_js_1 = __importDefault(require("./profile/delete.js"));
var setlocation_js_1 = __importDefault(require("./profile/setlocation.js"));
jest.mock('./profile/view.js', function () { return ({ __esModule: true, "default": jest.fn() }); });
jest.mock('./profile/delete.js', function () { return ({ __esModule: true, "default": jest.fn() }); });
jest.mock('./profile/setlocation.js', function () { return ({ __esModule: true, "default": jest.fn() }); });
describe('modules.users.commands.profile', function () {
    var interactions = [
        { id: 'interaction001', options: { getSubcommand: function () { return 'view'; } } },
        { id: 'interaction001', options: { getSubcommand: function () { return 'delete'; } } },
        { id: 'interaction001', options: { getSubcommand: function () { return 'setlocation'; } } },
    ];
    beforeEach(function () {
        jest.clearAllMocks();
    });
    afterAll(function () {
        jest.restoreAllMocks();
    });
    it('should contain certain properties', function () {
        expect(command.isLocked);
        expect(command.data.toJSON()).toEqual({
            name: 'profile',
            description: 'User profile information',
            options: [
                {
                    name: 'view',
                    description: 'View your profile',
                    options: [],
                    type: 1
                },
                {
                    name: 'delete',
                    description: 'Delete your profile',
                    options: [],
                    type: 1
                },
                {
                    name: 'setlocation',
                    description: 'Set your location',
                    type: 1,
                    options: [
                        {
                            name: 'location',
                            description: 'Location name or zip code',
                            type: 3,
                            required: true
                        }
                    ]
                }
            ]
        });
    });
    it('should redirect to sub command executors', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(interactions.map(function (interaction) { return command.execute(interaction); }))];
                    case 1:
                        _a.sent();
                        expect(view_js_1["default"]).toHaveBeenCalledWith(interactions[0]);
                        expect(delete_js_1["default"]).toHaveBeenCalledWith(interactions[1]);
                        expect(setlocation_js_1["default"]).toHaveBeenCalledWith(interactions[2]);
                        return [2 /*return*/];
                }
            });
        });
    });
});
