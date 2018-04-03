import * as React from 'react';
import * as ReactDOM from 'react-dom';
//import * as PQueue from 'p-queue';
import { PromiseQueue } from './PromiseQueue';

export interface IPageTransitionProps {
  data?: any;
  animateOnInit?: boolean;
  timeout?: number;
  compareChildren?: Function;
  onLoad?: Function;
  className?: string;
  onTransitionStart?: Function;
  onTransitionEnd?: Function;
  children?: any;
  location: {
    pathname: string;
  };
}

export interface IPageTransitionState {
  child1: React.ReactNode;
  child2: React.ReactNode;
  nextChild: number;
  pathname: string;
  animationStart: boolean;
}

export class PageTransition extends React.Component<IPageTransitionProps, IPageTransitionState> {
  queue = new PromiseQueue();

  static defaultProps: Partial<IPageTransitionProps> = {
    animateOnInit: false,
    timeout: 500
  };

  constructor(props: IPageTransitionProps) {
    super(props);
    const { animateOnInit, children, location } = props;
    const pathname = location && location.pathname || '';
    const animationStart = false;
    if (animateOnInit) {
      this.state = {
        pathname,
        animationStart,
        child1: null,
        child2: null,
        nextChild: 1,
      };
    } else {
      this.state = {
        pathname,
        animationStart,
        child1: children,
        child2: null,
        nextChild: 2,
      };
    }
  }

  componentDidMount() {
    const { animateOnInit, children } = this.props;
    const { nextChild } = this.state;
    if (animateOnInit) {
      if (nextChild === 1) this.setState({ child1: children });
      else this.setState({ child2: children });
      this.transite();
    } else {
      const child = this.getRef('child1') as React.ReactInstance;
      if (child) {
        const dom = ReactDOM.findDOMNode(child);
        if (dom) dom.classList.remove('transition-item');
      }
    }
  }

  componentDidUpdate() {
    if (this.state.animationStart) {
      this.setState({ animationStart: false })
      this.queue.add(() => this.transite());
    }
  }

  static getDerivedStateFromProps(
    nextProps: IPageTransitionProps,
    prevState: IPageTransitionState
  ): Partial<IPageTransitionState> {
    if (nextProps.location.pathname === prevState.pathname) return null;
    return {
      pathname: nextProps.location.pathname,
      animationStart: true,
      [`child${prevState.nextChild}`]: nextProps.children
    };
  }

  getRef(ref: string) {
    // Dirty way to check if the component is
    // wrapped with react-redux Connect
    let child = this.refs[ref] as any;// as ICustomReactElement;
    if (typeof child === 'object' && 'getWrappedInstance' in child) {
      const wrappedInstance = child['getWrappedInstance'];
      child = wrappedInstance();
    }

    return child as React.ReactInstance;
  }

  transite() {
    return new Promise(async (transiteDone, transiteFailed) => {
      // Force update helper
      const forceUpdate = () => this.forceUpdate(() => Promise.resolve());

      await forceUpdate();

      const prevChild = this.getRef(`child${this.state.nextChild === 1 ? 2 : 1}`);
      const newChild = this.getRef(`child${this.state.nextChild}`);
      const prevChildDom = ReactDOM.findDOMNode(prevChild) as HTMLElement;
      const newChildDom = ReactDOM.findDOMNode(newChild)as HTMLElement;

      const willStart = async () => {
        if (this.props.onTransitionStart) {
          await this.props.onTransitionStart();
        }
        return Promise.resolve();
      };

      // Add appear class and active class (or trigger manual start)
      const start = () => {
        if (newChildDom.classList.contains('transition-item')) {
          newChildDom.classList.add('transition-appear');
          newChildDom.offsetHeight; // Trigger layout to make sure transition happen
          newChildDom.classList.add('transition-appear-active');
        }
        if (prevChildDom) {
          prevChildDom.classList.add('transition-leave');
          prevChildDom.classList.add('transition-item');
          prevChildDom.offsetHeight; // Trigger layout to make sure transition happen
          prevChildDom.classList.add('transition-leave-active');
        }
        return Promise.resolve();
      };

      const delay = (timeout: number = 0) =>
        new Promise(resolve => setTimeout(() => resolve(), timeout));

      // Wait for transition
      const transitionDone = () => {
        // Swap child and remove the old child
        if (this.state.nextChild === 1) {
          this.setState({
            nextChild: 2,
            child2: null
          });
        } else {
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
        if (prevChildDom && prevChildDom.classList.contains('transition-item')) {
          prevChildDom.classList.remove('transition-leave');
          prevChildDom.classList.remove('transition-item');
          prevChildDom.classList.remove('transition-leave-active');
        }
        return Promise.resolve();
      };

      const didEnd = async () => {
        if (this.props.onTransitionEnd) {
          await this.props.onTransitionEnd();
        }
        return Promise.resolve();
      }

      try {
        await willStart();
        await start();
        await delay(this.props.timeout);
        await transitionDone();
        await end();
        await didEnd();
        transiteDone();
      } catch (error) {
        transiteFailed();
      }
    });
  }

  render() {
    let classNames = 'transition-wrapper';
    if (this.props.className) {
      classNames += ` ${this.props.className}`;
    }
    return (
      <div className={classNames}>
        {React.Children.map(this.state.child1, element =>
          React.cloneElement(element as React.ReactElement<any>, { ref: 'child1' }),
        )}
        {React.Children.map(this.state.child2, element =>
          React.cloneElement(element as React.ReactElement<any>, { ref: 'child2' }),
        )}
      </div>
    );
  }
}
