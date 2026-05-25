export declare class AsyncQueue<T> implements AsyncIterable<T> {
    private readonly queue;
    private readonly pending;
    private closed;
    private failure;
    push(item: T): void;
    close(): void;
    fail(err: unknown): void;
    [Symbol.asyncIterator](): AsyncIterator<T>;
    private next;
}
