export declare class PromiseQueue {
    private promises;
    private idle;
    constructor();
    add(promise: Function): void;
    private next();
}
