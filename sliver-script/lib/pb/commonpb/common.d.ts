import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export declare const protobufPackage = "commonpb";
export interface Empty {
}
/** Request - Common fields used in all gRPC requests */
export interface Request {
    Async: boolean;
    Timeout: string;
    BeaconID: string;
    SessionID: string;
}
/**
 * Response - Common fields used in all gRPC responses. Note that the Err field
 *            only used when the implant needs to return an error to the server.
 *            Client<->Server comms should use normal gRPC error handling.
 */
export interface Response {
    Err: string;
    Async: boolean;
    BeaconID: string;
    TaskID: string;
}
/** File - A basic file data type */
export interface File {
    Name: string;
    Data: Buffer;
}
/** Process - A basic process data type */
export interface Process {
    Pid: number;
    Ppid: number;
    Executable: string;
    Owner: string;
    Architecture: string;
    SessionID: number;
    CmdLine: string[];
}
/** EnvVar - Environment variable K/V */
export interface EnvVar {
    Key: string;
    Value: string;
}
export declare const Empty: MessageFns<Empty>;
export declare const Request: MessageFns<Request>;
export declare const Response: MessageFns<Response>;
export declare const File: MessageFns<File>;
export declare const Process: MessageFns<Process>;
export declare const EnvVar: MessageFns<EnvVar>;
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
