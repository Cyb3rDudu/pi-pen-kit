"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TunnelManager = void 0;
const rxjs_1 = require("rxjs");
const asyncQueue_1 = require("./asyncQueue");
class TunnelManager {
    outgoing = new asyncQueue_1.AsyncQueue();
    byTunnelId = new Map();
    abort = new AbortController();
    running = null;
    start(rpc) {
        if (this.running)
            return;
        this.running = (async () => {
            try {
                const stream = rpc.tunnelData(this.outgoing, { signal: this.abort.signal });
                for await (const msg of stream) {
                    const tunnelId = msg.TunnelID;
                    const subject = this.byTunnelId.get(tunnelId);
                    if (!subject)
                        continue;
                    subject.next(msg);
                    if (msg.Closed) {
                        subject.complete();
                        this.byTunnelId.delete(tunnelId);
                    }
                }
            }
            catch (err) {
                for (const subject of this.byTunnelId.values()) {
                    subject.error(err);
                }
                this.byTunnelId.clear();
                this.outgoing.fail(err);
            }
        })();
    }
    subscribe(tunnelId) {
        let subject = this.byTunnelId.get(tunnelId);
        if (!subject) {
            subject = new rxjs_1.Subject();
            this.byTunnelId.set(tunnelId, subject);
        }
        return subject.asObservable();
    }
    send(msg) {
        this.outgoing.push(msg);
    }
    async stop() {
        this.abort.abort();
        this.outgoing.close();
        if (this.running) {
            await this.running;
        }
        this.running = null;
        for (const subject of this.byTunnelId.values()) {
            subject.complete();
        }
        this.byTunnelId.clear();
    }
}
exports.TunnelManager = TunnelManager;
