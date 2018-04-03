/// <reference types="react" />
import * as React from 'react';
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
export declare class PageTransition extends React.Component<IPageTransitionProps, IPageTransitionState> {
    queue: PromiseQueue;
    static defaultProps: Partial<IPageTransitionProps>;
    constructor(props: IPageTransitionProps);
    componentDidMount(): void;
    componentDidUpdate(): void;
    static getDerivedStateFromProps(nextProps: IPageTransitionProps, prevState: IPageTransitionState): Partial<IPageTransitionState>;
    getRef(ref: string): React.ReactInstance;
    transite(): Promise<{}>;
    render(): JSX.Element;
}
