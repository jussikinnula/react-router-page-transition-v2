"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (timeout) {
    if (timeout === void 0) { timeout = 0; }
    return new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, timeout); });
});
//# sourceMappingURL=delay.js.map