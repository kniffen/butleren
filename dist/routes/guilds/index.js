"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var router_1 = __importDefault(require("./router"));
require("./base");
require("./guild");
require("./channels");
require("./roles");
exports["default"] = router_1["default"];
