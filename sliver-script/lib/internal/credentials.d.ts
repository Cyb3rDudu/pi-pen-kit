import * as grpc from "@grpc/grpc-js";
import type { SliverClientConfig } from "../config";
export declare function createSliverRpcCredentials(config: SliverClientConfig): grpc.ChannelCredentials;
