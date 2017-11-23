export class PromiseQueue {
  private promises: Function[] = [];
  private idle: boolean = true;

  constructor() {}

  add(promise: Function) {
    if (typeof promise === 'function') {
      this.promises.push(promise);
      this.next();
    }
  }

  private next() {
    if (this.idle && this.promises.length > 0) {
      const promise = this.promises.shift();
      this.idle = false;
      promise()
        .then(() => {
          this.idle = true;
          this.next();
        })
        .catch(() => {
          this.idle = true;
          this.next();
        });
    }
  }
}