export declare function withTimeoutSignal<T>(timeoutSeconds: number, fn: (signal: AbortSignal) => Promise<T>): Promise<T>;
