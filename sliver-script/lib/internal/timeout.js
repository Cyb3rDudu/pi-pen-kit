"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTimeoutSignal = withTimeoutSignal;
async function withTimeoutSignal(timeoutSeconds, fn) {
    if (!(timeoutSeconds > 0)) {
        return fn(new AbortController().signal);
    }
    const controller = new AbortController();
    const timeoutMs = Math.floor(timeoutSeconds * 1000);
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fn(controller.signal);
    }
    finally {
        clearTimeout(timer);
    }
}
