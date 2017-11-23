"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const PQueue = require("p-queue");
class PageTransition extends React.Component {
    constructor() {
        super(...arguments);
        this.queue = new PQueue({ concurrency: 1 });
    }
    static compareChildren(prevChild, nextChild) {
        if (prevChild !== undefined
            && prevChild !== null
            && nextChild !== undefined
            && nextChild !== null) {
            return prevChild.props.location.pathname === nextChild.props.location.pathname;
        }
        return false;
    }
    componentWillMount() {
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
    }
    componentDidMount() {
        if (!this.props.animateOnInit) {
            const child = this.getRef('child1');
            if (child !== undefined) {
                const dom = ReactDOM.findDOMNode(child);
                dom.classList.remove('transition-item');
            }
        }
        else {
            this.transite(this.props.children);
        }
    }
    componentWillReceiveProps(nextProps) {
        let isChildrenEqual;
        if (this.props.compareChildren !== undefined) {
            isChildrenEqual = this.props.compareChildren(this.props.children, nextProps.children);
        }
        else {
            isChildrenEqual = PageTransition.compareChildren(this.props.children, nextProps.children);
        }
        if (!isChildrenEqual) {
            this.queue.add(() => this.transite(nextProps.children));
        }
    }
    getRef(ref) {
        let child = this.refs[ref];
        if (typeof child === 'object' && 'getWrappedInstance' in child) {
            const wrappedInstance = child['getWrappedInstance'];
            child = wrappedInstance();
        }
        return child;
    }
    transite(nextChild) {
        return new Promise((transiteDone, transiteFailed) => __awaiter(this, void 0, void 0, function* () {
            if (this.state.nextChild === 1) {
                this.setState({ child1: nextChild });
            }
            else {
                this.setState({ child2: nextChild });
            }
            const forceUpdate = () => this.forceUpdate(() => Promise.resolve());
            yield forceUpdate();
            const prevChild = this.getRef(`child${this.state.nextChild === 1 ? 2 : 1}`);
            const newChild = this.getRef(`child${this.state.nextChild}`);
            const prevChildDom = ReactDOM.findDOMNode(prevChild);
            const newChildDom = ReactDOM.findDOMNode(newChild);
            const willStart = () => __awaiter(this, void 0, void 0, function* () {
                if (this.props.onTransitionStart !== undefined) {
                    yield this.props.onTransitionStart();
                }
                return Promise.resolve();
            });
            const start = () => {
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
            const delay = (timeout = 0) => new Promise(resolve => setTimeout(() => resolve(), timeout));
            const transitionDone = () => {
                if (this.state.nextChild === 1) {
                    this.setState({
                        nextChild: 2,
                        child2: null
                    });
                }
                else {
                    this.setState({
                        nextChild: 1,
                        child1: null
                    });
                }
            };
            const end = () => {
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
            const didEnd = () => __awaiter(this, void 0, void 0, function* () {
                if (this.props.onTransitionEnd !== undefined) {
                    yield this.props.onTransitionEnd();
                }
                return Promise.resolve();
            });
            try {
                yield willStart();
                yield start();
                yield delay(this.props.timeout);
                yield transitionDone();
                yield end();
                yield didEnd();
                transiteDone();
            }
            catch (error) {
                transiteFailed();
            }
        }));
    }
    render() {
        let classNames = 'transition-wrapper';
        if (this.props.className !== undefined) {
            classNames += ` ${this.props.className}`;
        }
        return (React.createElement("div", { className: classNames },
            React.Children.map(this.state.child1, element => React.cloneElement(element, { ref: 'child1' })),
            React.Children.map(this.state.child2, element => React.cloneElement(element, { ref: 'child2' }))));
    }
}
PageTransition.defaultProps = {
    animateOnInit: false,
    timeout: 500,
};
exports.PageTransition = PageTransition;
//# sourceMappingURL=PageTransition.js.map