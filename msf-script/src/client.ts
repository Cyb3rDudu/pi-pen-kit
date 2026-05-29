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

import { encode, decode, ExtensionCodec } from "@msgpack/msgpack";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";

// msfrpcd encodes string keys as msgpack bin type (0xc4) instead of str type
// (0xaX). @msgpack/msgpack v3 decodes bin as Uint8Array, which the default
// mapKeyConverter rejects ("The type of key must be string or number but object").
// Fix: pass a custom mapKeyConverter that converts Uint8Array → utf8 string.
function binAwareKeyConverter(key: unknown): string | number {
  if (typeof key === "string" || typeof key === "number") return key;
  if (key instanceof Uint8Array) return Buffer.from(key).toString("utf8");
  return String(key);
}

/**
 * Recursively convert Uint8Array values to utf8 strings.
 * msfrpcd encodes ALL values (including strings) as msgpack binary type.
 * Binary data (payloads) is preserved as Buffer via a null-byte heuristic:
 *   - Contains null bytes → binary data (keep as Buffer)
 *   - No null bytes → msfrpcd string (convert to utf8)
 */
function normalizeBin(v: unknown): unknown {
  if (v instanceof Uint8Array && !(v instanceof Buffer)) {
    if (v.indexOf(0) !== -1) return Buffer.from(v);
    return Buffer.from(v).toString("utf8");
  }
  if (Array.isArray(v)) return v.map(normalizeBin);
  if (v != null && typeof v === "object" && !(v instanceof Date) && !(v instanceof Buffer)) {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as object)) out[k] = normalizeBin(val);
    return out;
  }
  return v;
}

/** Safely coerce a value from an RPC response to a string (Buffer or actual string). */
function str(v: unknown): string {
  if (v instanceof Buffer) return v.toString("utf8");
  if (typeof v === "string") return v;
  return "";
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

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

const DEFAULTS = {
  host: "127.0.0.1",
  port: 55553,
  username: "msf",
  ssl: true,
  timeout: 30000,
  uri: "/api/",
};

// ---------------------------------------------------------------------------
// RPC transport
// ---------------------------------------------------------------------------

function rpcRequest(
  method: string,
  args: unknown[],
  config: Required<MsfRpcConfig>,
  raw = false,
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const payload = encode([method, ...args]);
    const doRequest = config.ssl ? httpsRequest : httpRequest;

    const opts = {
      hostname: config.host,
      port: config.port,
      path: config.uri,
      method: "POST",
      headers: {
        "Content-Type": "binary/message-pack",
        "Content-Length": payload.length,
      },
      rejectUnauthorized: false, // msfrpcd uses self-signed certs
    };

    const timer = setTimeout(() => {
      req.destroy(new Error(`RPC timeout: ${method} (${config.timeout}ms)`));
    }, config.timeout);

    const req = doRequest(opts, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        clearTimeout(timer);
        try {
          const data = Buffer.concat(chunks);
          if (data.length === 0) {
            reject(new Error(`Empty response for ${method}`));
            return;
          }
          const decoded = normalizeBin(decode(data, { mapKeyConverter: binAwareKeyConverter })) as Record<string, unknown>;
          if (decoded.error === true) {
            reject(new Error((decoded.error_message as string) ?? `RPC error: ${method}`));
          } else {
            resolve(decoded);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });

    req.write(payload);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export class MsfRpcClient {
  private config: Required<MsfRpcConfig>;
  private token = "";
  private _connected = false;

  constructor(config: MsfRpcConfig) {
    this.config = { ...DEFAULTS, ...config } as Required<MsfRpcConfig>;
  }

  get isConnected(): boolean {
    return this._connected;
  }

  /** Authenticate and obtain a session token. */
  async connect(): Promise<this> {
    const savedTimeout = this.config.timeout;
    // Use shorter timeout for the auth probe to fail fast on SSL mismatch
    const probeTimeout = (this.config as any).connectTimeout as number | undefined;
    if (probeTimeout && probeTimeout < savedTimeout) {
      this.config.timeout = probeTimeout;
    }
    try {
      const res = (await rpcRequest("auth.login", [
        this.config.username,
        this.config.password,
      ], this.config)) as Record<string, string>;

      if (!res.token) {
        throw new Error("auth.login failed: no token returned");
      }
      this.token = res.token;
      this._connected = true;
      return this;
    } finally {
      this.config.timeout = savedTimeout;
    }
  }

  /** Disconnect (invalidate token). */
  async disconnect(): Promise<void> {
    if (this.token) {
      try {
        await this.call("auth.logout", this.token);
      } catch {
        // Best-effort
      }
      this.token = "";
      this._connected = false;
    }
  }

  /** Low-level RPC call. Automatically prepends the auth token.
   *  On token expiry, re-authenticates once and retries the call. */
  async call(method: string, ...args: unknown[]): Promise<any> {
    if (!this.token && method !== "auth.login") {
      throw new Error("Not connected — call connect() first");
    }
    try {
      return await rpcRequest(method, [this.token, ...args], this.config);
    } catch (e) {
      if (e instanceof Error && e.message.includes("Invalid Authentication Token")) {
        // Token expired — re-authenticate and retry once
        await this.connect();
        return rpcRequest(method, [this.token, ...args], this.config);
      }
      throw e;
    }
  }

  // -----------------------------------------------------------------------
  // Auth
  // -----------------------------------------------------------------------

  async tokenList(): Promise<string[]> {
    const res = await this.call("auth.token_list");
    return res.tokens ?? [];
  }

  async tokenGenerate(): Promise<string> {
    const res = await this.call("auth.token_generate");
    return res.token;
  }

  // -----------------------------------------------------------------------
  // Core
  // -----------------------------------------------------------------------

  async version(): Promise<{ version: string; ruby: string; api: string }> {
    return this.call("core.version");
  }

  async moduleStats(): Promise<Record<string, number>> {
    return this.call("core.module_stats");
  }

  async reloadModules(): Promise<Record<string, number>> {
    return this.call("core.reload_modules");
  }

  async setg(key: string, value: string): Promise<void> {
    await this.call("core.setg", key, value);
  }

  async unsetg(key: string): Promise<void> {
    await this.call("core.unsetg", key);
  }

  async save(): Promise<void> {
    await this.call("core.save");
  }

  // -----------------------------------------------------------------------
  // Modules
  // -----------------------------------------------------------------------

  async listExploits(): Promise<string[]> {
    const res = await this.call("module.exploits");
    return res.modules ?? [];
  }

  async listAuxiliary(): Promise<string[]> {
    const res = await this.call("module.auxiliary");
    return res.modules ?? [];
  }

  async listPost(): Promise<string[]> {
    const res = await this.call("module.post");
    return res.modules ?? [];
  }

  async listPayloads(): Promise<string[]> {
    const res = await this.call("module.payloads");
    return res.modules ?? [];
  }

  async listEncoders(): Promise<string[]> {
    const res = await this.call("module.encoders");
    return res.modules ?? [];
  }

  async moduleInfo(type: string, name: string): Promise<Record<string, any>> {
    return this.call("module.info", type, name);
  }

  async moduleOptions(type: string, name: string): Promise<Record<string, any>> {
    return this.call("module.options", type, name);
  }

  async compatiblePayloads(moduleName: string): Promise<string[]> {
    const res = await this.call("module.compatible_payloads", moduleName);
    return res.payloads ?? [];
  }

  async compatibleSessions(moduleName: string): Promise<string[]> {
    const res = await this.call("module.compatible_sessions", moduleName);
    return res.sessions ?? [];
  }

  /**
   * Execute a module (exploit, auxiliary, or post).
   * Returns { job_id, uuid } for exploit/auxiliary/post.
   * For payload type, returns { payload: Buffer }.
   */
  async moduleExecute(
    type: string,
    name: string,
    options: Record<string, unknown>,
  ): Promise<Record<string, any>> {
    return this.call("module.execute", type, name, options);
  }

  /**
   * Check if a target is vulnerable using a module's check method.
   * Returns { job_id, uuid }.
   */
  async moduleCheck(
    type: string,
    name: string,
    options: Record<string, unknown>,
  ): Promise<Record<string, any>> {
    return this.call("module.check", type, name, options);
  }

  /** Get the results of a completed module run by UUID. */
  async moduleResults(uuid: string): Promise<Record<string, any>> {
    return this.call("module.results", uuid);
  }

  /** Get running/waiting/result module stats. */
  async moduleRunningStats(): Promise<Record<string, any>> {
    return this.call("module.running_stats");
  }

  // -----------------------------------------------------------------------
  // Jobs
  // -----------------------------------------------------------------------

  async jobList(): Promise<Record<string, string>> {
    return this.call("job.list");
  }

  async jobInfo(jobId: number | string): Promise<Record<string, any>> {
    return this.call("job.info", String(jobId));
  }

  async jobStop(jobId: number | string): Promise<void> {
    await this.call("job.stop", String(jobId));
  }

  // -----------------------------------------------------------------------
  // Sessions
  // -----------------------------------------------------------------------

  async sessionList(): Promise<Record<string, SessionInfo>> {
    return this.call("session.list");
  }

  async sessionStop(sessionId: number | string): Promise<void> {
    await this.call("session.stop", Number(sessionId));
  }

  async shellRead(sessionId: number | string, readPointer?: number): Promise<{ seq: number; data: string }> {
    const args: unknown[] = [Number(sessionId)];
    if (readPointer !== undefined) args.push(readPointer);
    return this.call("session.shell_read", ...args);
  }

  async shellWrite(sessionId: number | string, data: string): Promise<{ write_count: number }> {
    return this.call("session.shell_write", Number(sessionId), data);
  }

  async meterpreterWrite(sessionId: number | string, command: string): Promise<void> {
    await this.call("session.meterpreter_write", Number(sessionId), command);
  }

  async meterpreterRead(sessionId: number | string): Promise<{ data: string }> {
    return this.call("session.meterpreter_read", Number(sessionId));
  }

  async meterpreterRunSingle(sessionId: number | string, command: string): Promise<void> {
    await this.call("session.meterpreter_run_single", Number(sessionId), command);
  }

  /** Send a shell command and wait for output. Handles both shell and meterpreter sessions. */
  async sessionCommand(
    sessionId: number | string,
    command: string,
    timeoutMs = 15000,
    pollIntervalMs = 500,
  ): Promise<string> {
    const sessions = await this.sessionList();
    const info = sessions[String(sessionId)];
    if (!info) throw new Error(`Session ${sessionId} not found`);

    const isMeterpreter = info.type === "meterpreter";
    const cmd = command.endsWith("\n") ? command : command + "\n";

    if (isMeterpreter) {
      await this.meterpreterRunSingle(Number(sessionId), command);
    } else {
      await this.shellWrite(Number(sessionId), cmd);
    }

    // Poll for output
    const deadline = Date.now() + timeoutMs;
    let output = "";
    while (Date.now() < deadline) {
      if (isMeterpreter) {
        const res = await this.meterpreterRead(Number(sessionId));
        const data = str(res.data);
        if (data.trim().length > 0) {
          output += data;
          // Give it one more poll to see if there's more
          await sleep(pollIntervalMs);
          const res2 = await this.meterpreterRead(Number(sessionId));
          output += str(res2.data);
          break;
        }
      } else {
        const res = await this.shellRead(Number(sessionId));
        const data = str(res.data);
        if (data.trim().length > 0) {
          output += data;
          break;
        }
      }
      await sleep(pollIntervalMs);
    }

    return output.trim();
  }

  async shellUpgrade(sessionId: number | string, lhost: string, lport: number): Promise<void> {
    await this.call("session.shell_upgrade", Number(sessionId), lhost, lport);
  }

  async sessionCompatibleModules(sessionId: number | string): Promise<string[]> {
    const res = await this.call("session.compatible_modules", Number(sessionId));
    return res.modules ?? [];
  }

  // -----------------------------------------------------------------------
  // Consoles
  // -----------------------------------------------------------------------

  async consoleCreate(): Promise<{ id: string; prompt: string; busy: boolean }> {
    return this.call("console.create");
  }

  async consoleDestroy(consoleId: string): Promise<void> {
    await this.call("console.destroy", consoleId);
  }

  async consoleList(): Promise<Record<string, ConsoleInfo>> {
    return this.call("console.list");
  }

  async consoleWrite(consoleId: string, data: string): Promise<{ wrote: number }> {
    return this.call("console.write", consoleId, data);
  }

  async consoleRead(consoleId: string): Promise<{ data: string; prompt: string; busy: boolean }> {
    return this.call("console.read", consoleId);
  }

  /**
   * Run a console command and wait for output.
   * Creates a temporary console, runs the command, reads output, then destroys the console.
   */
  async consoleCommand(
    command: string,
    timeoutMs = 15000,
    pollIntervalMs = 500,
  ): Promise<string> {
    const con = await this.consoleCreate();
    const consoleId = con.id;

    try {
      await this.consoleWrite(consoleId, command + "\n");

      const deadline = Date.now() + timeoutMs;
      let output = "";
      while (Date.now() < deadline) {
        const res = await this.consoleRead(consoleId);
        output += str(res.data);
        if (!res.busy && output.trim().length > 0) break;
        await sleep(pollIntervalMs);
      }

      return output.trim();
    } finally {
      await this.consoleDestroy(consoleId).catch(() => {});
    }
  }

  // -----------------------------------------------------------------------
  // Plugins
  // -----------------------------------------------------------------------

  async pluginLoad(name: string, options?: Record<string, unknown>): Promise<void> {
    await this.call("plugin.load", name, options ?? {});
  }

  async pluginUnload(name: string): Promise<void> {
    await this.call("plugin.unload", name);
  }

  async pluginLoaded(): Promise<string[]> {
    const res = await this.call("plugin.loaded");
    return res.plugins ?? [];
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SessionInfo {
  type: string; // "shell" | "meterpreter"
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
