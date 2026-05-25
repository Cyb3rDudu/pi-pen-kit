"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncQueue = void 0;
class AsyncQueue {
    queue = [];
    pending = [];
    closed = false;
    failure = null;
    push(item) {
        if (this.closed) {
            throw new Error("AsyncQueue is closed");
        }
        const waiter = this.pending.shift();
        if (waiter) {
            waiter.resolve({ value: item, done: false });
            return;
        }
        this.queue.push(item);
    }
    close() {
        if (this.closed)
            return;
        this.closed = true;
        for (const waiter of this.pending.splice(0, this.pending.length)) {
            waiter.resolve({ value: undefined, done: true });
        }
    }
    fail(err) {
        if (this.closed)
            return;
        this.failure = err;
        this.closed = true;
        for (const waiter of this.pending.splice(0, this.pending.length)) {
            waiter.reject(err);
        }
    }
    [Symbol.asyncIterator]() {
        return {
            next: () => this.next(),
            return: async () => {
                this.close();
                return { value: undefined, done: true };
            },
        };
    }
    next() {
        if (this.failure) {
            return Promise.reject(this.failure);
        }
        const item = this.queue.shift();
        if (item !== undefined) {
            return Promise.resolve({ value: item, done: false });
        }
        if (this.closed) {
            return Promise.resolve({ value: undefined, done: true });
        }
        return new Promise((resolve, reject) => {
            this.pending.push({ resolve, reject });
        });
    }
}
exports.AsyncQueue = AsyncQueue;
