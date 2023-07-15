"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var onError_1 = __importDefault(require("./onError"));
describe('discord.eventHandlers.onError()', function () {
    var err = new Error('Test error');
    beforeAll(function () {
        (0, onError_1["default"])(err);
    });
    it('should log errors', function () {
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(err);
    });
});
