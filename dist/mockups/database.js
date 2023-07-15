"use strict";
jest.mock('../database', function () {
    var sqlite3 = jest.requireActual('sqlite3');
    var open = jest.requireActual('sqlite').open;
    return {
        __esModule: true,
        "default": open({
            filename: ':memory:',
            driver: sqlite3.Database
        })
    };
});
