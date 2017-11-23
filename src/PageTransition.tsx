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
}

export interface IPageTransitionState {
  child1: React.ReactNode;
  child2: React.ReactNode;
  nextChild: number;
}

export class PageTransition extends React.Component<IPageTransitionProps, IPageTransitionState> {
  //queue = new PQueue({ concurrency: 1 });
  queue = new PromiseQueue();

  static defaultProps: Partial<IPageTransitionProps> = {
    animateOnInit: false,
    timeout: 500,
  };

  static compareChildren(prevChild: any, nextChild: any) {
    if (
      prevChild !== undefined
      && prevChild !== null
      && nextChild !== undefined
      && nextChild !== null
    ) {
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
    } else  {
      this.setState({
        child1: this.props.children,
        child2: null,
        nextChild: 2
      });
    }
  }

  componentDidMount() {
    if (!this.props.animateOnInit) {
      const child = this.getRef('child1') as React.ReactInstance;
      if (child !== undefined) {
        const dom = ReactDOM.findDOMNode(child);
        dom.classList.remove('transition-item');
      }
    } else {
      this.transite(this.props.children);
    }
  }

  componentWillReceiveProps(nextProps: IPageTransitionProps) {
    let isChildrenEqual;
    if (this.props.compareChildren !== undefined) {
      isChildrenEqual = this.props.compareChildren(this.props.children, nextProps.children);
    } else {
      isChildrenEqual = PageTransition.compareChildren(this.props.children, nextProps.children);
    }

    if (!isChildrenEqual) {
      this.queue.add(() => this.transite(nextProps.children));
    }
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

  transite(nextChild: React.ReactNode) {
    return new Promise(async (transiteDone, transiteFailed) => {
      // Render the new children
      if (this.state.nextChild === 1) {
        this.setState({ child1: nextChild });
      } else {
        this.setState({ child2: nextChild });
      }

      // Force update helper
      const forceUpdate = () => this.forceUpdate(() => Promise.resolve());

      await forceUpdate();

      const prevChild = this.getRef(`child${this.state.nextChild === 1 ? 2 : 1}`);
      const newChild = this.getRef(`child${this.state.nextChild}`);
      const prevChildDom = ReactDOM.findDOMNode(prevChild) as HTMLElement;
      const newChildDom = ReactDOM.findDOMNode(newChild)as HTMLElement;

      const willStart = async () => {
        if (this.props.onTransitionStart !== undefined) {
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
        if (prevChildDom !== undefined && prevChildDom.classList.contains('transition-item')) {
          prevChildDom.classList.remove('transition-leave');
          prevChildDom.classList.remove('transition-item');
          prevChildDom.classList.remove('transition-leave-active');
        }
        return Promise.resolve();
      };

      const didEnd = async () => {
        if (this.props.onTransitionEnd !== undefined) {
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
    if (this.props.className !== undefined) {
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
