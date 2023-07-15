"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var http_proxy_middleware_1 = require("http-proxy-middleware");
var guilds_1 = __importDefault(require("./guilds"));
var modules_1 = __importDefault(require("./modules"));
var commands_1 = __importDefault(require("./commands"));
var modules_2 = require("../modules");
var app = (0, express_1["default"])();
var port = process.env.APP_PORT || 5000;
if ('development' !== process.env.NODE_ENV)
    app.use(express_1["default"].static('client/build'));
app.use(body_parser_1["default"].urlencoded({ extended: false }));
app.use(body_parser_1["default"].json());
app.use('/api/guilds', guilds_1["default"]);
app.use('/api/modules', modules_1["default"]);
app.use('/api/commands', commands_1["default"]);
if (modules_2.spotifyModule.router)
    app.use('/api/spotify', modules_2.spotifyModule.router);
if (modules_2.twitterModule.router)
    app.use('/api/twitter', modules_2.twitterModule.router);
if (modules_2.twitchModule.router)
    app.use('/api/twitch', modules_2.twitchModule.router);
if (modules_2.youtubeModule.router)
    app.use('/api/youtube', modules_2.youtubeModule.router);
// Proxy other request in order to use the webpack dev server for the client.
if ('development' === process.env.NODE_ENV)
    app.use('*', (0, http_proxy_middleware_1.createProxyMiddleware)({ target: 'http://127.0.0.1:3000', ws: true }));
app.listen(port, function () { return console.log("Router: Listening on port ".concat(port)); });
