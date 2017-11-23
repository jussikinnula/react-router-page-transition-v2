var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "react-dom", "p-queue"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var React = require("react");
    var ReactDOM = require("react-dom");
    var PQueue = require("p-queue");
    var PageTransition = (function (_super) {
        __extends(PageTransition, _super);
        function PageTransition() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.queue = new PQueue({ concurrency: 1 });
            return _this;
        }
        PageTransition.compareChildren = function (prevChild, nextChild) {
            if (prevChild !== undefined
                && prevChild !== null
                && nextChild !== undefined
                && nextChild !== null) {
                return prevChild.props.location.pathname === nextChild.props.location.pathname;
            }
            return false;
        };
        PageTransition.prototype.componentWillMount = function () {
            if (this.props.animateOnInit) {
                this.setState({
                    child1: null,
                    child2: null,
                    nextChild: 1
                });
            }
            else {
                this.setState({
                    child1: this.props.children,
                    child2: null,
                    nextChild: 2
                });
            }
        };
        PageTransition.prototype.componentDidMount = function () {
            if (!this.props.animateOnInit) {
                var child = this.getRef('child1');
                if (child !== undefined) {
                    var dom = ReactDOM.findDOMNode(child);
                    dom.classList.remove('transition-item');
                }
            }
            else {
                this.transite(this.props.children);
            }
        };
        PageTransition.prototype.componentWillReceiveProps = function (nextProps) {
            var _this = this;
            var isChildrenEqual;
            if (this.props.compareChildren !== undefined) {
                isChildrenEqual = this.props.compareChildren(this.props.children, nextProps.children);
            }
            else {
                isChildrenEqual = PageTransition.compareChildren(this.props.children, nextProps.children);
            }
            if (!isChildrenEqual) {
                this.queue.add(function () { return _this.transite(nextProps.children); });
            }
        };
        PageTransition.prototype.getRef = function (ref) {
            var child = this.refs[ref];
            if (typeof child === 'object' && 'getWrappedInstance' in child) {
                var wrappedInstance = child['getWrappedInstance'];
                child = wrappedInstance();
            }
            return child;
        };
        PageTransition.prototype.transite = function (nextChild) {
            var _this = this;
            return new Promise(function (transiteDone, transiteFailed) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                var forceUpdate, prevChild, newChild, prevChildDom, newChildDom, willStart, start, delay, transitionDone, end, didEnd, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.state.nextChild === 1) {
                                this.setState({ child1: nextChild });
                            }
                            else {
                                this.setState({ child2: nextChild });
                            }
                            forceUpdate = function () { return _this.forceUpdate(function () { return Promise.resolve(); }); };
                            return [4, forceUpdate()];
                        case 1:
                            _a.sent();
                            prevChild = this.getRef("child" + (this.state.nextChild === 1 ? 2 : 1));
                            newChild = this.getRef("child" + this.state.nextChild);
                            prevChildDom = ReactDOM.findDOMNode(prevChild);
                            newChildDom = ReactDOM.findDOMNode(newChild);
                            willStart = function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(this.props.onTransitionStart !== undefined)) return [3, 2];
                                            return [4, this.props.onTransitionStart()];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [2, Promise.resolve()];
                                    }
                                });
                            }); };
                            start = function () {
                                if (newChildDom.classList.contains('transition-item')) {
                                    newChildDom.classList.add('transition-appear');
                                    newChildDom.offsetHeight;
                                    newChildDom.classList.add('transition-appear-active');
                                }
                                if (prevChildDom) {
                                    prevChildDom.classList.add('transition-leave');
                                    prevChildDom.classList.add('transition-item');
                                    prevChildDom.offsetHeight;
                                    prevChildDom.classList.add('transition-leave-active');
                                }
                                return Promise.resolve();
                            };
                            delay = function (timeout) {
                                if (timeout === void 0) { timeout = 0; }
                                return new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, timeout); });
                            };
                            transitionDone = function () {
                                if (_this.state.nextChild === 1) {
                                    _this.setState({
                                        nextChild: 2,
                                        child2: null
                                    });
                                }
                                else {
                                    _this.setState({
                                        nextChild: 1,
                                        child1: null
                                    });
                                }
                            };
                            end = function () {
                                if (newChildDom.classList.contains('transition-item')) {
                                    newChildDom.classList.remove('transition-appear');
                                    newChildDom.classList.remove('transition-item');
                                    newChildDom.classList.remove('transition-appear-active');
                                }
                                if (prevChildDom !== undefined && prevChildDom.classList.contains('transition-item')) {
                                    prevChildDom.classList.remove('transition-leave');
                                    prevChildDom.classList.remove('transition-item');
                                    prevChildDom.classList.remove('transition-leave-active');
                                }
                                return Promise.resolve();
                            };
                            didEnd = function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(this.props.onTransitionEnd !== undefined)) return [3, 2];
                                            return [4, this.props.onTransitionEnd()];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [2, Promise.resolve()];
                                    }
                                });
                            }); };
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 9, , 10]);
                            return [4, willStart()];
                        case 3:
                            _a.sent();
                            return [4, start()];
                        case 4:
                            _a.sent();
                            return [4, delay(this.props.timeout)];
                        case 5:
                            _a.sent();
                            return [4, transitionDone()];
                        case 6:
                            _a.sent();
                            return [4, end()];
                        case 7:
                            _a.sent();
                            return [4, didEnd()];
                        case 8:
                            _a.sent();
                            transiteDone();
                            return [3, 10];
                        case 9:
                            error_1 = _a.sent();
                            transiteFailed();
                            return [3, 10];
                        case 10: return [2];
                    }
                });
            }); });
        };
        PageTransition.prototype.render = function () {
            var classNames = 'transition-wrapper';
            if (this.props.className !== undefined) {
                classNames += " " + this.props.className;
            }
            return (React.createElement("div", { className: classNames },
                React.Children.map(this.state.child1, function (element) {
                    return React.cloneElement(element, { ref: 'child1' });
                }),
                React.Children.map(this.state.child2, function (element) {
                    return React.cloneElement(element, { ref: 'child2' });
                })));
        };
        PageTransition.defaultProps = {
            animateOnInit: false,
            timeout: 500,
        };
        return PageTransition;
    }(React.Component));
    exports.PageTransition = PageTransition;
});
//# sourceMappingURL=PageTransition.js.map