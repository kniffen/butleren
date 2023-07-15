"use strict";
jest.mock('node-fetch', function () { return ({
    __esModule: true,
    "default": jest.fn()
}); });
