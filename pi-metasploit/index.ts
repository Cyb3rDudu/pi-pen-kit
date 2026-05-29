/**
 * pi-metasploit — Metasploit C2 operator client as a Pi extension.
 *
 * Exposes the Metasploit RPC API (msfrpcd) to the Pi coding agent as
 * native tools. Covers module management, exploit/auxiliary/post execution,
 * session interaction (shell + meterpreter), job management, and console access.
 *
 * Configuration:
 *   MSF_HOST       msfrpcd host (default 127.0.0.1)
 *   MSF_PORT       msfrpcd port (default 55553)
 *   MSF_PASSWORD   RPC password (required, set via msfrpcd -P)
 *   MSF_USERNAME   RPC username (default msf)
 *   MSF_SSL        Use HTTPS (default true)
 *   MSF_DISABLE    Any non-empty value disables the extension.
 *
 * License: MIT
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { MsfRpcClient, type SessionInfo } from "msf-script";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";

// ---------------------------------------------------------------------------
// Config + connection state
// ---------------------------------------------------------------------------

const DISABLED = !!process.env.MSF_DISABLE;
const MSF_HOST = process.env.MSF_HOST?.trim() || "127.0.0.1";
const MSF_PORT = parseInt(process.env.MSF_PORT?.trim() || "55553", 10);
const MSF_PASSWORD = process.env.MSF_PASSWORD?.trim() || "";
const MSF_USERNAME = process.env.MSF_USERNAME?.trim() || "msf";
const MSF_SSL = process.env.MSF_SSL?.trim() !== "false";
const DOWNLOAD_DIR = process.env.MSF_DOWNLOAD_DIR?.trim() || join(tmpdir(), "pi-metasploit");

function ensureDownloadDir(): string {
  try { mkdirSync(DOWNLOAD_DIR, { recursive: true }); } catch {}
  return DOWNLOAD_DIR;
}

let client: MsfRpcClient | undefined;
let uiRef: { notify: (msg: string, level?: string) => void } = {
  notify: () => {},
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function jsonResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    details: data,
  };
}

/** Safely coerce a value from an RPC response to a string (Buffer or actual string). */
function str(v: unknown): string {
  if (v instanceof Buffer) return v.toString("utf8");
  if (typeof v === "string") return v;
  return "";
}

function textResult(text: string, details?: Record<string, unknown>) {
  return {
    content: [{ type: "text" as const, text }],
    details: details ?? {},
  };
}

function errorResult(e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  return { content: [{ type: "text" as const, text: `error: ${msg}` }], details: { error: msg } };
}

/** Convert session list to a more readable summary. */
function summarizeSessions(sessions: Record<string, SessionInfo>) {
  return Object.entries(sessions).map(([id, s]) => ({
    id: Number(id),
    type: str(s.type),
    info: str(s.info),
    tunnel: `${str(s.tunnel_local)} ← ${str(s.tunnel_peer)}`,
    via: `${str(s.via_exploit)} + ${str(s.via_payload)}`,
    platform: `${str(s.platform)}/${str(s.arch)}`,
    host: str(s.target_host) || str(s.session_host),
  }));
}

/** Lazy-connect to msfrpcd. Auto-detects SSL if MSF_SSL is not explicitly set. */
async function getClient(): Promise<MsfRpcClient> {
  if (client?.isConnected) return client;
  if (!MSF_PASSWORD) throw new Error("MSF_PASSWORD env var is required");

  const sslExplicitlySet = "MSF_SSL" in process.env;

  client = new MsfRpcClient({
    host: MSF_HOST,
    port: MSF_PORT,
    password: MSF_PASSWORD,
    username: MSF_USERNAME,
    ssl: MSF_SSL,
    connectTimeout: 5000,
  });

  try {
    await client.connect();
    return client;
  } catch (e) {
    // If SSL wasn't explicitly configured and the connection failed or timed out,
    // retry with the opposite SSL setting — msfrpcd -S runs plain HTTP.
    if (!sslExplicitlySet) {
      const fallbackSsl = !MSF_SSL;
      uiRef.notify(`[metasploit] SSL=${MSF_SSL} failed, retrying with SSL=${fallbackSsl}...`, "warn");
      client = new MsfRpcClient({
        host: MSF_HOST,
        port: MSF_PORT,
        password: MSF_PASSWORD,
        username: MSF_USERNAME,
        ssl: fallbackSsl,
        connectTimeout: 5000,
      });
      await client.connect();
      return client;
    }
    throw e;
  }
}

// ---------------------------------------------------------------------------
// Exported pure functions (testable without MSF server)
// ---------------------------------------------------------------------------

/** Filter module list by search term. */
export function filterModules(modules: string[], term: string, limit = 50): string[] {
  if (!term) return modules.slice(0, limit);
  const lower = term.toLowerCase();
  return modules.filter((m) => m.toLowerCase().includes(lower)).slice(0, limit);
}

/** Parse options string "KEY=VAL,KEY2=VAL2" into a dict. */
export function parseOptionsString(input: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const pair of input.split(",")) {
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    const key = pair.slice(0, eq).trim();
    const val = pair.slice(eq + 1).trim();
    if (key) result[key] = val;
  }
  return result;
}

/** Short session summary string. */
export function sessionSummary(id: string, s: SessionInfo): string {
  return `[#${id}] ${str(s.type)} — ${str(s.info) || str(s.desc)} (${str(s.platform)}/${str(s.arch)}) from ${str(s.target_host) || str(s.session_host)}`;
}

// ---------------------------------------------------------------------------
// Extension factory
// ---------------------------------------------------------------------------

export default async function piMetasploitExtension(pi: ExtensionAPI) {
  if (DISABLED) return;

  pi.on("session_start", async (_event, ctx) => {
    if (ctx.hasUI) uiRef = ctx.ui;
    getClient().catch(() => {});
  });

  pi.on("session_shutdown", async () => {
    try {
      await client?.disconnect();
    } catch {}
    client = undefined;
  });

  // =======================================================================
  // Core / Status
  // =======================================================================

  pi.registerTool({
    name: "msf_version",
    label: "Metasploit: version",
    description: "Return the Metasploit framework version, Ruby version, and API version.",
    parameters: Type.Object({}),
    async execute() {
      try {
        const c = await getClient();
        return jsonResult(await c.version());
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "msf_status",
    label: "Metasploit: status",
    description: "One-shot snapshot: version, module counts, active sessions, and running jobs.",
    parameters: Type.Object({}),
    async execute() {
      try {
        const c = await getClient();
        const [version, stats, sessions, jobs] = await Promise.all([
          c.version(),
          c.moduleStats(),
          c.sessionList().catch(() => ({})),
          c.jobList().catch(() => ({})),
        ]);
        return jsonResult({
          version,
          modules: stats,
          sessions: Object.keys(sessions).length,
          sessionDetails: summarizeSessions(sessions),
          jobs: Object.keys(jobs).length,
          jobDetails: jobs,
        });
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  // =======================================================================
  // Modules
  // =======================================================================

  pi.registerTool({
    name: "msf_search_exploits",
    label: "Metasploit: search exploits",
    description: "List exploit modules, optionally filtered by search term.",
    parameters: Type.Object({
      search: Type.Optional(Type.String({ description: "Filter term (case-insensitive)", default: "" })),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        const all = await c.listExploits();
        return jsonResult(filterModules(all, p.search ?? ""));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "msf_search_auxiliary",
    label: "Metasploit: search auxiliary",
    description: "List auxiliary modules (scanners, fuzzers, admin tools), optionally filtered.",
    parameters: Type.Object({
      search: Type.Optional(Type.String({ description: "Filter term", default: "" })),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        const all = await c.listAuxiliary();
        return jsonResult(filterModules(all, p.search ?? ""));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "msf_search_post",
    label: "Metasploit: search post modules",
    description: "List post-exploitation modules, optionally filtered.",
    parameters: Type.Object({
      search: Type.Optional(Type.String({ description: "Filter term", default: "" })),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        const all = await c.listPost();
        return jsonResult(filterModules(all, p.search ?? ""));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "msf_search_payloads",
    label: "Metasploit: search payloads",
    description: "List payload modules, optionally filtered.",
    parameters: Type.Object({
      search: Type.Optional(Type.String({ description: "Filter term", default: "" })),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        const all = await c.listPayloads();
        return jsonResult(filterModules(all, p.search ?? ""));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "msf_module_info",
    label: "Metasploit: module info",
    description: "Get detailed info about a module (name, description, rank, options, references).",
    parameters: Type.Object({
      module_type: Type.Union(
        [Type.Literal("exploit"), Type.Literal("auxiliary"), Type.Literal("post"), Type.Literal("payload"), Type.Literal("encoder")],
        { description: "Module type" },
      ),
      module_name: Type.String({ description: "Module path (e.g. 'windows/smb/ms17_010_psexec')" }),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        const [info, options] = await Promise.all([
          c.moduleInfo(p.module_type, p.module_name),
          c.moduleOptions(p.module_type, p.module_name).catch(() => ({})),
        ]);
        return jsonResult({ info, options });
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "msf_compatible_payloads",
    label: "Metasploit: compatible payloads",
    description: "List payloads compatible with an exploit module.",
    parameters: Type.Object({
      module_name: Type.String({ description: "Exploit module path" }),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        return jsonResult(await c.compatiblePayloads(p.module_name));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  // =======================================================================
  // Execution
  // =======================================================================

  pi.registerTool({
    name: "msf_run_exploit",
    label: "Metasploit: run exploit",
    description:
      "Run an exploit module. Returns job_id and uuid. Use msf_module_results to check the outcome. For synchronous execution with output, use msf_console_run instead.",
    parameters: Type.Object({
      module_name: Type.String({ description: "Exploit module path (e.g. 'windows/smb/ms17_010_psexec')" }),
      options: Type.Record(Type.String(), Type.String(), { description: "Module options as string key-value pairs (e.g. { RHOSTS: '10.10.10.5', LHOST: '10.10.14.5', LPORT: '4444' })" }),
      payload: Type.Optional(Type.String({ description: "Payload name (e.g. 'windows/meterpreter/reverse_tcp')" })),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        const opts: Record<string, unknown> = { ...p.options };
        if (p.payload) opts.PAYLOAD = p.payload;
        const result = await c.moduleExecute("exploit", p.module_name, opts);
        return jsonResult(result);
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "msf_run_auxiliary",
    label: "Metasploit: run auxiliary",
    description: "Run an auxiliary module (scanner, fuzzer, admin tool). Returns job_id and uuid.",
    parameters: Type.Object({
      module_name: Type.String({ description: "Auxiliary module path" }),
      options: Type.Record(Type.String(), Type.String(), { description: "Module options as string key-value pairs" }),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        const result = await c.moduleExecute("auxiliary", p.module_name, p.options);
        return jsonResult(result);
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "msf_run_post",
    label: "Metasploit: run post module",
    description: "Run a post-exploitation module against an active session.",
    parameters: Type.Object({
      module_name: Type.String({ description: "Post module path" }),
      session_id: Type.Number({ description: "Target session ID" }),
      options: Type.Optional(Type.Record(Type.String(), Type.String(), { description: "Additional module options as string key-value pairs", default: {} })),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        const opts: Record<string, unknown> = { ...(p.options ?? {}), SESSION: p.session_id };
        const result = await c.moduleExecute("post", p.module_name, opts);
        return jsonResult(result);
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "msf_check",
    label: "Metasploit: check vulnerability",
    description: "Run a module's check method to test if a target is vulnerable. Returns { job_id, uuid }. Poll with msf_module_results.",
    parameters: Type.Object({
      module_name: Type.String({ description: "Module path" }),
      module_type: Type.Union(
        [Type.Literal("exploit"), Type.Literal("auxiliary")],
        { description: "Module type", default: "exploit" },
      ),
      options: Type.Record(Type.String(), Type.String(), { description: "Module options as string key-value pairs (must include RHOSTS)" }),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        const result = await c.moduleCheck(p.module_type ?? "exploit", p.module_name, p.options);
        return jsonResult(result);
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "msf_module_results",
    label: "Metasploit: module results",
    description: "Get results of a completed module run by UUID.",
    parameters: Type.Object({
      uuid: Type.String({ description: "UUID from msf_run_exploit/msf_run_auxiliary/msf_check" }),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        return jsonResult(await c.moduleResults(p.uuid));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "msf_running_stats",
    label: "Metasploit: running stats",
    description: "Get stats on currently running, waiting, and completed module runs.",
    parameters: Type.Object({}),
    async execute() {
      try {
        const c = await getClient();
        return jsonResult(await c.moduleRunningStats());
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  // =======================================================================
  // Jobs
  // =======================================================================

  pi.registerTool({
    name: "msf_jobs",
    label: "Metasploit: list jobs",
    description: "List all active background jobs (handlers, exploits, etc).",
    parameters: Type.Object({}),
    async execute() {
      try {
        const c = await getClient();
        return jsonResult(await c.jobList());
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "msf_job_info",
    label: "Metasploit: job info",
    description: "Get details about a specific job.",
    parameters: Type.Object({
      job_id: Type.Number({ description: "Job ID" }),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        return jsonResult(await c.jobInfo(p.job_id));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "msf_job_stop",
    label: "Metasploit: stop job",
    description: "Stop a running job by ID.",
    parameters: Type.Object({
      job_id: Type.Number({ description: "Job ID to stop" }),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        await c.jobStop(p.job_id);
        return jsonResult({ result: "success", job_id: p.job_id });
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  // =======================================================================
  // Sessions
  // =======================================================================

  pi.registerTool({
    name: "msf_sessions",
    label: "Metasploit: list sessions",
    description: "List all active sessions (shells and meterpreters) with details.",
    parameters: Type.Object({}),
    async execute() {
      try {
        const c = await getClient();
        const sessions = await c.sessionList();
        return jsonResult(summarizeSessions(sessions));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "msf_session_command",
    label: "Metasploit: session command",
    description:
      "Send a command to a session (shell or meterpreter) and get the output. For meterpreter, this runs the command directly (e.g. 'sysinfo', 'getuid', 'ps'). For shells, it sends the command and reads output.",
    parameters: Type.Object({
      session_id: Type.Number({ description: "Session ID" }),
      command: Type.String({ description: "Command to execute" }),
      timeout: Type.Optional(Type.Number({ description: "Timeout in seconds (default 15)", default: 15, minimum: 1 })),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        const output = await c.sessionCommand(p.session_id, p.command, (p.timeout ?? 15) * 1000);
        return textResult(output, { session_id: p.session_id, command: p.command });
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "msf_session_run_script",
    label: "Metasploit: run meterpreter script",
    description:
      "Run a post module or meterpreter command against a session. Use this for post-exploitation actions like hashdump, screenshot, etc.",
    parameters: Type.Object({
      module_name: Type.String({ description: "Post module path (e.g. 'windows/gather/hashdump')" }),
      session_id: Type.Number({ description: "Target session ID" }),
      options: Type.Optional(Type.Record(Type.String(), Type.String(), { description: "Additional options as string key-value pairs", default: {} })),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        const opts: Record<string, unknown> = { ...(p.options ?? {}), SESSION: p.session_id };
        const result = await c.moduleExecute("post", p.module_name, opts);
        return jsonResult(result);
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "msf_session_stop",
    label: "Metasploit: stop session",
    description: "Terminate an active session.",
    parameters: Type.Object({
      session_id: Type.Number({ description: "Session ID to terminate" }),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        await c.sessionStop(p.session_id);
        return jsonResult({ result: "success", session_id: p.session_id });
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  // =======================================================================
  // File transfer (meterpreter sessions only)
  // =======================================================================

  pi.registerTool({
    name: "msf_session_upload",
    label: "Metasploit: upload file",
    description:
      "Upload a file to a meterpreter session via the meterpreter channel. Paths are relative to the msfrpcd working directory. Only works with meterpreter sessions, not shell sessions.",
    parameters: Type.Object({
      session_id: Type.Number({ description: "Meterpreter session ID" }),
      local_path: Type.String({ description: "Local file path (relative to msfrpcd working directory)" }),
      remote_path: Type.String({ description: "Remote destination path on target" }),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        await c.sessionUpload(p.session_id, p.local_path, p.remote_path);
        return jsonResult({ result: "success", session_id: p.session_id, local_path: p.local_path, remote_path: p.remote_path });
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "msf_session_download",
    label: "Metasploit: download file",
    description:
      "Download a file from a meterpreter session via the meterpreter channel. The file is saved relative to the msfrpcd working directory. Only works with meterpreter sessions, not shell sessions.",
    parameters: Type.Object({
      session_id: Type.Number({ description: "Meterpreter session ID" }),
      remote_path: Type.String({ description: "Remote file path to download from target" }),
      local_path: Type.String({ description: "Local save path (relative to msfrpcd working directory)" }),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        await c.sessionDownload(p.session_id, p.remote_path, p.local_path);
        return jsonResult({ result: "success", session_id: p.session_id, remote_path: p.remote_path, local_path: p.local_path });
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  // =======================================================================
  // Console
  // =======================================================================

  pi.registerTool({
    name: "msf_console",
    label: "Metasploit: console command",
    description:
      "Run any msfconsole command and get the output. Creates a temporary console, runs the command, reads output, then cleans up. Use for anything that doesn't have a dedicated tool (e.g. 'setg LHOST 10.10.14.5', 'workspace', 'db_nmap').",
    parameters: Type.Object({
      command: Type.String({ description: "msfconsole command (e.g. 'db_nmap -sV 10.10.10.5')" }),
      timeout: Type.Optional(Type.Number({ description: "Timeout in seconds (default 30)", default: 30, minimum: 1 })),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        const output = await c.consoleCommand(p.command, (p.timeout ?? 30) * 1000);
        return textResult(output, { command: p.command });
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  // =======================================================================
  // Listeners (convenience wrappers)
  // =======================================================================

  pi.registerTool({
    name: "msf_start_listener",
    label: "Metasploit: start handler",
    description:
      "Start a multi/handler listener for a payload. Returns job_id of the handler.",
    parameters: Type.Object({
      payload: Type.String({ description: "Payload type (e.g. 'windows/meterpreter/reverse_tcp')" }),
      lhost: Type.String({ description: "Listener bind address" }),
      lport: Type.Number({ description: "Listener port", minimum: 1, maximum: 65535 }),
      options: Type.Optional(Type.Record(Type.String(), Type.String(), { description: "Additional payload options as string key-value pairs", default: {} })),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        const opts: Record<string, unknown> = {
          ...(p.options ?? {}),
          PAYLOAD: p.payload,
          LHOST: p.lhost,
          LPORT: p.lport,
          ExitOnSession: false,
        };
        const result = await c.moduleExecute("exploit", "multi/handler", opts);
        uiRef.notify(`[metasploit] handler started on ${p.lhost}:${p.lport} (${p.payload})`, "info");
        return jsonResult(result);
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  // =======================================================================
  // Extension metadata
  // =======================================================================

  pi.registerTool({
    name: "msf_generate_payload",
    label: "Metasploit: generate payload",
    description:
      "Generate a standalone payload, save it to the payloads directory, and return the local file path and size.",
    parameters: Type.Object({
      payload_type: Type.String({ description: "Payload (e.g. 'windows/meterpreter/reverse_tcp')" }),
      format: Type.String({ description: "Output format: elf, exe, raw, python, bash, powershell, etc." }),
      filename: Type.Optional(Type.String({ description: "Output filename (default: payload.<format>)" })),
      options: Type.Record(Type.String(), Type.String(), { description: "Payload options as string key-value pairs (LHOST, LPORT, etc.)" }),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        const opts: Record<string, unknown> = {
          ...p.options,
          Format: p.format,
        };
        const result = await c.moduleExecute("payload", p.payload_type, opts);
        // moduleExecute for payload type returns { payload: <binary> }
        // normalizeBin preserves binary data as Buffer, text data as string
        const raw = (result as any)?.payload;
        if (!raw) return jsonResult(result); // fallback: return raw if no payload field
        const buf = raw instanceof Buffer ? raw : Buffer.from(raw, "utf8");
        const dir = ensureDownloadDir();
        const name = p.filename ?? `payload.${p.format}`;
        const localPath = join(dir, name);
        writeFileSync(localPath, buf);
        return jsonResult({ local_path: localPath, bytes: buf.length, payload_type: p.payload_type, format: p.format });
      } catch (e) {
        return errorResult(e);
      }
    },
  });
}
