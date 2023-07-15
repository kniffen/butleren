"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var sqlite3_1 = __importDefault(require("sqlite3"));
var sqlite_1 = require("sqlite");
var DBPATH = path_1["default"].resolve(__dirname, '../../../data.db');
// Ensures the database file exists
if (!fs_1["default"].existsSync(DBPATH))
    fs_1["default"].writeFileSync(DBPATH, '');
exports["default"] = (0, sqlite_1.open)({
    filename: 'data.db',
    driver: sqlite3_1["default"].Database
});
