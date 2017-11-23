/// <reference types="react" />
/// <reference types="p-queue" />
import * as React from 'react';
import * as PQueue from 'p-queue';
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
export declare class PageTransition extends React.Component<IPageTransitionProps, IPageTransitionState> {
    queue: PQueue<PQueue.DefaultAddOptions>;
    static defaultProps: Partial<IPageTransitionProps>;
    static compareChildren(prevChild: any, nextChild: any): boolean;
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: IPageTransitionProps): void;
    getRef(ref: string): React.ReactInstance;
    transite(nextChild: React.ReactNode): Promise<{}>;
    render(): JSX.Element;
}
