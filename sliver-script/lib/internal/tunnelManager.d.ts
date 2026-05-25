import { type Observable } from "rxjs";
import type { SliverRPCClient, DeepPartial } from "../pb/rpcpb/services";
import type { TunnelData } from "../pb/sliverpb/sliver";
export declare class TunnelManager {
    private readonly outgoing;
    private readonly byTunnelId;
    private readonly abort;
    private running;
    start(rpc: SliverRPCClient): void;
    subscribe(tunnelId: string): Observable<TunnelData>;
    send(msg: DeepPartial<TunnelData>): void;
    stop(): Promise<void>;
}
