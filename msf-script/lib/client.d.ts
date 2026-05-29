/**
 * msf-script — Metasploit RPC client for Node.js
 *
 * Talks to msfrpcd over HTTP + MessagePack.
 * Mirrors the RPC method groups: auth, core, console, module, job, session, db.
 *
 * Usage:
 *   const msf = new MsfRpcClient({ host: '127.0.0.1', port: 55553, password: 'pass' });
 *   await msf.connect();
 *   const sessions = await msf.sessions();
 */
export interface MsfRpcConfig {
    /** msfrpcd host (default 127.0.0.1) */
    host?: string;
    /** msfrpcd port (default 55553) */
    port?: number;
    /** RPC password (set via msfrpcd -P) */
    password: string;
    /** RPC username (default msf) */
    username?: string;
    /** Use HTTPS (default true, msfrpcd defaults to SSL) */
    ssl?: boolean;
    /** Request timeout in ms (default 30000) */
    timeout?: number;
    /** Connection/auth timeout in ms (default: same as timeout) */
    connectTimeout?: number;
    /** URI path (default /api/) */
    uri?: string;
}
export declare class MsfRpcClient {
    private config;
    private token;
    private _connected;
    constructor(config: MsfRpcConfig);
    get isConnected(): boolean;
    /** Authenticate and obtain a session token. */
    connect(): Promise<this>;
    /** Disconnect (invalidate token). */
    disconnect(): Promise<void>;
    /** Low-level RPC call. Automatically prepends the auth token.
     *  On token expiry, re-authenticates once and retries the call. */
    call(method: string, ...args: unknown[]): Promise<any>;
    tokenList(): Promise<string[]>;
    tokenGenerate(): Promise<string>;
    version(): Promise<{
        version: string;
        ruby: string;
        api: string;
    }>;
    moduleStats(): Promise<Record<string, number>>;
    reloadModules(): Promise<Record<string, number>>;
    setg(key: string, value: string): Promise<void>;
    unsetg(key: string): Promise<void>;
    save(): Promise<void>;
    listExploits(): Promise<string[]>;
    listAuxiliary(): Promise<string[]>;
    listPost(): Promise<string[]>;
    listPayloads(): Promise<string[]>;
    listEncoders(): Promise<string[]>;
    moduleInfo(type: string, name: string): Promise<Record<string, any>>;
    moduleOptions(type: string, name: string): Promise<Record<string, any>>;
    compatiblePayloads(moduleName: string): Promise<string[]>;
    compatibleSessions(moduleName: string): Promise<string[]>;
    /**
     * Execute a module (exploit, auxiliary, or post).
     * Returns { job_id, uuid } for exploit/auxiliary/post.
     * For payload type, returns { payload: Buffer }.
     */
    moduleExecute(type: string, name: string, options: Record<string, unknown>): Promise<Record<string, any>>;
    /**
     * Check if a target is vulnerable using a module's check method.
     * Returns { job_id, uuid }.
     */
    moduleCheck(type: string, name: string, options: Record<string, unknown>): Promise<Record<string, any>>;
    /** Get the results of a completed module run by UUID. */
    moduleResults(uuid: string): Promise<Record<string, any>>;
    /** Get running/waiting/result module stats. */
    moduleRunningStats(): Promise<Record<string, any>>;
    jobList(): Promise<Record<string, string>>;
    jobInfo(jobId: number | string): Promise<Record<string, any>>;
    jobStop(jobId: number | string): Promise<void>;
    sessionList(): Promise<Record<string, SessionInfo>>;
    sessionStop(sessionId: number | string): Promise<void>;
    shellRead(sessionId: number | string, readPointer?: number): Promise<{
        seq: number;
        data: string;
    }>;
    shellWrite(sessionId: number | string, data: string): Promise<{
        write_count: number;
    }>;
    meterpreterWrite(sessionId: number | string, command: string): Promise<void>;
    meterpreterRead(sessionId: number | string): Promise<{
        data: string;
    }>;
    meterpreterRunSingle(sessionId: number | string, command: string): Promise<void>;
    /** Send a shell command and wait for output. Handles both shell and meterpreter sessions. */
    sessionCommand(sessionId: number | string, command: string, timeoutMs?: number, pollIntervalMs?: number): Promise<string>;
    shellUpgrade(sessionId: number | string, lhost: string, lport: number): Promise<void>;
    /** Upload a file to a meterpreter session. Returns the remote path on success. */
    sessionUpload(sessionId: number | string, localPath: string, remotePath: string): Promise<string>;
    /** Download a file from a meterpreter session. Returns the file data as a Buffer. */
    sessionDownload(sessionId: number | string, remotePath: string): Promise<Buffer>;
    sessionCompatibleModules(sessionId: number | string): Promise<string[]>;
    consoleCreate(): Promise<{
        id: string;
        prompt: string;
        busy: boolean;
    }>;
    consoleDestroy(consoleId: string): Promise<void>;
    consoleList(): Promise<Record<string, ConsoleInfo>>;
    consoleWrite(consoleId: string, data: string): Promise<{
        wrote: number;
    }>;
    consoleRead(consoleId: string): Promise<{
        data: string;
        prompt: string;
        busy: boolean;
    }>;
    /**
     * Run a console command and wait for output.
     * Creates a temporary console, runs the command, reads output, then destroys the console.
     */
    consoleCommand(command: string, timeoutMs?: number, pollIntervalMs?: number): Promise<string>;
    pluginLoad(name: string, options?: Record<string, unknown>): Promise<void>;
    pluginUnload(name: string): Promise<void>;
    pluginLoaded(): Promise<string[]>;
}
export interface SessionInfo {
    type: string;
    tunnel_local: string;
    tunnel_peer: string;
    via_exploit: string;
    via_payload: string;
    desc: string;
    info: string;
    workspace: string;
    session_host: string;
    session_port: number;
    target_host: string;
    username: string;
    uuid: string;
    exploit_uuid: string;
    routes: string[];
    arch: string;
    platform: string;
}
export interface ConsoleInfo {
    id: string;
    prompt: string;
    busy: boolean;
}
//# sourceMappingURL=client.d.ts.map