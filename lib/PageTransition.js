"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var PromiseQueue_1 = require("./PromiseQueue");
var delay_1 = require("./delay");
var runCallback_1 = require("./runCallback");
var PageTransition = (function (_super) {
    __extends(PageTransition, _super);
    function PageTransition(props) {
        var _this = _super.call(this, props) || this;
        _this.queue = new PromiseQueue_1.default();
        var animateOnInit = props.animateOnInit, children = props.children, location = props.location;
        var pathname = location && location.pathname || '';
        var animationStart = false;
        if (animateOnInit) {
            _this.state = {
                pathname: pathname,
                animationStart: animationStart,
                child1: null,
                child2: null,
                nextChild: 1,
            };
        }
        else {
            _this.state = {
                pathname: pathname,
                animationStart: animationStart,
                child1: children,
                child2: null,
                nextChild: 2,
            };
        }
        return _this;
    }
    PageTransition.prototype.componentDidMount = function () {
        var _a = this.props, animateOnInit = _a.animateOnInit, children = _a.children;
        var nextChild = this.state.nextChild;
        if (animateOnInit) {
            if (nextChild === 1)
                this.setState({ child1: children });
            else
                this.setState({ child2: children });
            this.transite();
        }
        else {
            var child = this.getRef('child1');
            if (child) {
                var dom = ReactDOM.findDOMNode(child);
                if (dom)
                    dom.classList.remove('transition-item');
            }
        }
    };
    PageTransition.prototype.componentDidUpdate = function () {
        var _this = this;
        if (this.state.animationStart) {
            this.setState({ animationStart: false });
            this.queue.add(function () { return _this.transite(); });
        }
    };
    PageTransition.getDerivedStateFromProps = function (nextProps, prevState) {
        var _a;
        if (nextProps.location.pathname === prevState.pathname)
            return null;
        return _a = {
                pathname: nextProps.location.pathname,
                animationStart: true
            },
            _a["child" + prevState.nextChild] = nextProps.children,
            _a;
    };
    PageTransition.prototype.getRef = function (ref) {
        var child = this.refs[ref];
        if (child && child.wrappedInstance)
            return child.getWrappedInstance();
        return child;
    };
    PageTransition.prototype.transite = function () {
        return __awaiter(this, void 0, void 0, function () {
            var prevChild, newChild, prevChildDom, newChildDom, start, transitionDone, end, didEnd, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.forceUpdate()];
                    case 1:
                        _a.sent();
                        prevChild = this.getRef("child" + (this.state.nextChild === 1 ? 2 : 1));
                        newChild = this.getRef("child" + this.state.nextChild);
                        prevChildDom = ReactDOM.findDOMNode(prevChild);
                        newChildDom = ReactDOM.findDOMNode(newChild);
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
                        end = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (newChildDom.classList.contains('transition-item')) {
                                    newChildDom.classList.remove('transition-appear');
                                    newChildDom.classList.remove('transition-item');
                                    newChildDom.classList.remove('transition-appear-active');
                                }
                                if (prevChildDom && prevChildDom.classList.contains('transition-item')) {
                                    prevChildDom.classList.remove('transition-leave');
                                    prevChildDom.classList.remove('transition-item');
                                    prevChildDom.classList.remove('transition-leave-active');
                                }
                                return [2];
                            });
                        }); };
                        didEnd = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!this.props.onTransitionEnd) return [3, 2];
                                        return [4, this.props.onTransitionEnd()];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2];
                                }
                            });
                        }); };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 9, , 10]);
                        return [4, runCallback_1.default(this.props.onTransitionStart)];
                    case 3:
                        _a.sent();
                        return [4, start()];
                    case 4:
                        _a.sent();
                        return [4, delay_1.default(this.props.timeout)];
                    case 5:
                        _a.sent();
                        return [4, transitionDone()];
                    case 6:
                        _a.sent();
                        return [4, end()];
                    case 7:
                        _a.sent();
                        return [4, runCallback_1.default(this.props.onTransitionEnd)];
                    case 8:
                        _a.sent();
                        return [3, 10];
                    case 9:
                        error_1 = _a.sent();
                        console.error('Error during transition', error_1);
                        return [3, 10];
                    case 10: return [2];
                }
            });
        });
    };
    PageTransition.prototype.render = function () {
        var classNames = 'transition-wrapper';
        if (this.props.className) {
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
        timeout: 500
    };
    return PageTransition;
}(React.Component));
exports.PageTransition = PageTransition;
//# sourceMappingURL=PageTransition.js.map