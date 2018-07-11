"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PromiseQueue = (function () {
    function PromiseQueue() {
        this.promises = [];
        this.idle = true;
    }
    PromiseQueue.prototype.add = function (promise) {
        if (typeof promise === 'function') {
            this.promises.push(promise);
            this.next();
        }
    };
    PromiseQueue.prototype.next = function () {
        var _this = this;
        if (this.idle && this.promises.length > 0) {
            var promise = this.promises.shift();
            this.idle = false;
            promise()
                .then(function () {
                _this.idle = true;
                _this.next();
            })
                .catch(function () {
                _this.idle = true;
                _this.next();
            });
        }
    };
    return PromiseQueue;
}());
exports.default = PromiseQueue;
//# sourceMappingURL=PromiseQueue.js.map