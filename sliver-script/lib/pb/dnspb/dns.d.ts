import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export declare const protobufPackage = "dnspb";
export declare enum DNSMessageType {
    /** NOP - aka FINGERPRINT */
    NOP = 0,
    INIT = 2,
    POLL = 3,
    CLOSE = 4,
    MANIFEST = 6,
    DATA_TO_IMPLANT = 7,
    DATA_FROM_IMPLANT = 8,
    CLEAR = 9,
    UNRECOGNIZED = -1
}
export declare function dNSMessageTypeFromJSON(object: any): DNSMessageType;
export declare function dNSMessageTypeToJSON(object: DNSMessageType): string;
/**
 * NOTE: DNS is very space sensitive so certain fields are re-purposed
 * depending on the DNSMessageType.
 */
export interface DNSMessage {
    Type: DNSMessageType;
    /** 8 bit message id + 24 bit dns session ID */
    ID: number;
    /** Bytes start at */
    Start: number;
    /** Bytes stop at */
    Stop: number;
    /** Total size */
    Size: number;
    /** Actual data */
    Data: Buffer;
}
export declare const DNSMessage: MessageFns<DNSMessage>;
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
    create(base?: DeepPartial<T>): T;
    fromPartial(object: DeepPartial<T>): T;
}
export {};
