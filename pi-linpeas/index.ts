/**
 * pi-linpeas — linPEAS privilege escalation enumeration as a Pi extension.
 *
 * Downloads linPEAS from GitHub releases, deploys to targets via any transport
 * (SSH, Sliver, Metasploit), and parses the output into structured findings.
 *
 * Configuration:
 *   PI_LINPEAS_DISABLE    Any non-empty value disables the extension.
 *   PI_LINPEAS_CACHE_DIR  Local directory for cached downloads (default: $TMPDIR/pi-linpeas).
 *   PI_LINPEAS_VERSION    GitHub release tag (default: latest).
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mkdirSync, statSync, writeFileSync, readFileSync } from "node:fs";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const DISABLED = !!process.env.PI_LINPEAS_DISABLE;
const CACHE_DIR = process.env.PI_LINPEAS_CACHE_DIR?.trim() || join(tmpdir(), "pi-linpeas");
const LINPEAS_VERSION = process.env.PI_LINPEAS_VERSION?.trim() || "latest";

const GITHUB_API = "https://api.github.com/repos/peass-ng/PEASS-ng/releases";

const SEVERITY_ORDER: Record<string, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  info: 1,
};

// SUID/SGID binaries that are standard/expected on most Linux systems — low severity.
const STANDARD_SUID = new Set([
  "chsh", "chfn", "newgrp", "sg", "su", "sudo", "umount", "mount",
  "passwd", "gpasswd", "at", "cron", "ssh-agent",
  "dbus-daemon-launch-helper", "polkit-agent-helper-1",
  "nmap", "vim", "find", "python3", "python3.10", "python3.11",
  "python3.12", "perl", "ruby", "awk", "less", "more", "nano",
]);

// Dangerous capabilities that typically lead to privesc.
const DANGEROUS_CAPS = new Set([
  "cap_setuid", "cap_setgid", "cap_setfcap", "cap_dac_override",
  "cap_dac_read_search", "cap_sys_admin", "cap_sys_ptrace",
  "cap_sys_module", "cap_net_raw", "cap_net_admin",
  "cap_perfmon", "cap_sys_admin", "cap_audit_control",
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function jsonResult(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }], details: data };
}

function textResult(text: string, details?: Record<string, unknown>) {
  return { content: [{ type: "text" as const, text }], details: details ?? {} };
}

function errorResult(e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  return { content: [{ type: "text" as const, text: `error: ${msg}` }], details: { error: msg } };
}

function ensureCacheDir(): string {
  mkdirSync(CACHE_DIR, { recursive: true });
  return CACHE_DIR;
}

// ---------------------------------------------------------------------------
// GitHub download
// ---------------------------------------------------------------------------

export async function downloadLinPEAS(options: {
  variant?: string;
  version?: string;
  cacheDir?: string;
}): Promise<{ localPath: string; cached: boolean }> {
  const variant = options.variant ?? "linpeas.sh";
  const cacheDir = options.cacheDir ?? ensureCacheDir();
  const cachePath = join(cacheDir, variant);

  // Check cache
  try {
    const stat = statSync(cachePath);
    if (stat.size > 1000) {
      return { localPath: cachePath, cached: true };
    }
  } catch {}

  // Fetch releases from GitHub API
  const url = options.version && options.version !== "latest"
    ? `${GITHUB_API}/tags/${encodeURIComponent(options.version)}`
    : GITHUB_API;

  const res = await fetch(url, { headers: { "User-Agent": "pi-linpeas/1.0" } });
  if (!res.ok) throw new Error(`GitHub API returned ${res.status}: ${await res.text()}`);

  const releases = await res.json() as Array<{ tag_name: string; assets: Array<{ name: string; browser_download_url: string }> }>;
  const release = releases[0];
  if (!release) throw new Error("No releases found");

  const asset = release.assets.find((a) => a.name === variant);
  if (!asset) throw new Error(`Asset '${variant}' not found in release ${release.tag_name}`);

  const binRes = await fetch(asset.browser_download_url);
  if (!binRes.ok) throw new Error(`Download failed: ${binRes.status}`);

  const buffer = Buffer.from(await binRes.arrayBuffer());
  writeFileSync(cachePath, buffer);

  return { localPath: cachePath, cached: false };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LinPEASFinding {
  type: string;
  severity: string;
  title: string;
  detail: string;
  section: string;
}

export interface LinPEASParseResult {
  summary: {
    total_findings: number;
    by_severity: Record<string, number>;
    by_type: Record<string, number>;
  };
  system_info: {
    hostname?: string;
    os?: string;
    kernel?: string;
    user?: string;
    groups?: string[];
  };
  findings: LinPEASFinding[];
}

// ---------------------------------------------------------------------------
// Parser — severity classification
// ---------------------------------------------------------------------------

export function classifySeverity(type: string, content: string): string {
  const lower = content.toLowerCase();

  // Critical
  if (/\/etc\/shadow/.test(lower) && /writable|write/.test(lower)) return "critical";
  if (/NOPASSWD[\s:]+ALL/.test(content)) return "critical";
  if (/\bdocker\.sock/.test(lower)) return "critical";
  if (/(?:password|passwd).*=.+/.test(lower) && !/password_file|shadow_file|password_permission/.test(lower)) return "critical";
  if (/hash[:=].+\$[0-9]/.test(lower)) return "critical";
  if (/root:[x*]:.+\$[0-9a-f]{10,}/.test(lower)) return "critical";

  // High
  if (type === "capabilities") {
    for (const cap of DANGEROUS_CAPS) {
      if (lower.includes(cap)) return "high";
    }
  }
  if (type === "suid") {
    const binName = lower.split("/").pop()?.trim().split(/\s+/)[0] ?? "";
    if (!STANDARD_SUID.has(binName) && binName.length > 0) return "high";
  }
  if (type === "sgid") {
    const binName = lower.split("/").pop()?.trim().split(/\s+/)[0] ?? "";
    if (!STANDARD_SUID.has(binName) && binName.length > 0) return "high";
  }
  if (/sudo.*NOPASSWD/.test(content)) return "high";
  if (/writable.*\/etc\/sudoers/.test(lower)) return "high";
  if (/writable.*\/etc\/cron/.test(lower)) return "high";
  if (/docker.*socket/.test(lower)) return "high";
  if (/container.*docker/.test(lower)) return "high";
  if (type === "kernel" && /vuln|exploit|cve/.test(lower)) return "high";

  // Medium
  if (type === "cron") return "medium";
  if (type === "writable" && /\/etc\//.test(lower)) return "medium";
  if (type === "kernel") return "medium";
  if (/writable.*\/var\/www/.test(lower)) return "medium";
  if (/writable.*\/opt\//.test(lower)) return "medium";

  // Low — everything else that's a finding
  if (type === "suid" || type === "sgid") return "low";
  if (type === "capabilities") return "low";
  if (type === "writable") return "low";

  return "info";
}

// ---------------------------------------------------------------------------
// Parser — section extraction
// ---------------------------------------------------------------------------

export function extractSection(text: string, sectionName: string): string | null {
  const lines = text.split("\n");
  let inSection = false;
  const sectionLines: string[] = [];

  for (const line of lines) {
    // Section headers: [+] Section Name, [*] Section, [!>] Section
    const headerMatch = line.match(/^\s*\[(?:\+|\*|!>|>)\]\s+([A-Z][A-Za-z\s&\/]+)/);
    if (headerMatch) {
      if (inSection) break;
      if (headerMatch[1].toLowerCase().includes(sectionName.toLowerCase())) {
        inSection = true;
        continue;
      }
    }
    if (inSection) {
      sectionLines.push(line);
    }
  }

  return sectionLines.length > 0 ? sectionLines.join("\n") : null;
}

// ---------------------------------------------------------------------------
// Parser — individual section parsers
// ---------------------------------------------------------------------------

function makeFinding(type: string, section: string, detail: string): LinPEASFinding {
  const title = detail.trim().split("\n")[0].slice(0, 120);
  return {
    type,
    severity: classifySeverity(type, detail),
    title,
    detail: detail.trim(),
    section,
  };
}

export function parseSUID(text: string): LinPEASFinding[] {
  const section = extractSection(text, "SUID") ?? text;
  const findings: LinPEASFinding[] = [];
  const lines = section.split("\n");

  for (const line of lines) {
    // Match paths with SUID bit (-s or -4000) in ls output
    const permMatch = line.match(/^-[rwxs-]+.*s[-rwxsts-]+\s+\S+\s+\S+\s+\S+\s+\S+\s+(\S+)/);
    if (permMatch) {
      findings.push(makeFinding("suid", "SUID/SGID Binaries", permMatch[1]));
      continue;
    }
    // Match bare paths or suspicious commands (no ls permission prefix like -rwsr-xr-x)
    const trimmed = line.trim();
    const isLsPerm = /^-[rwxsStTlL-]{9}/.test(trimmed);
    if (trimmed && !isLsPerm && !trimmed.startsWith("#") && !trimmed.startsWith("[") && trimmed.length > 1) {
      findings.push(makeFinding("suid", "SUID/SGID Binaries", trimmed));
    }
  }
  return findings;
}

export function parseCapabilities(text: string): LinPEASFinding[] {
  const section = extractSection(text, "Capabilit") ?? text;
  const findings: LinPEASFinding[] = [];
  const lines = section.split("\n");

  for (const line of lines) {
    const match = line.match(/cap_\w+/g);
    if (match) {
      for (const cap of match) {
        findings.push(makeFinding("capabilities", "Capabilities", cap));
      }
    }
  }
  return findings;
}

export function parseSudoRules(text: string): LinPEASFinding[] {
  const section = extractSection(text, "Sudo") ?? text;
  const findings: LinPEASFinding[] = [];
  const lines = section.split("\n");

  for (const line of lines) {
    if (/(?:NOPASSWD|SETENV|NOEXEC)/i.test(line)) {
      findings.push(makeFinding("sudo", "Sudo Rules", line.trim()));
    }
  }
  return findings;
}

export function parseCronJobs(text: string): LinPEASFinding[] {
  const section = extractSection(text, "Cron") ?? extractSection(text, "Scheduled") ?? text;
  const findings: LinPEASFinding[] = [];
  const lines = section.split("\n");

  for (const line of lines) {
    if (/^[*#]/.test(line.trim())) continue; // skip comment headers
    if (/\*\/etc\/cron|\*crontab|\*\*\/var\/spool/.test(line) && !/^#/.test(line.trim())) {
      findings.push(makeFinding("cron", "Cron Jobs", line.trim()));
    }
    if (/(^|\s)(sudo|root|chmod|chown|curl|wget)\b/.test(line) && /\*\/etc\//.test(line)) {
      findings.push(makeFinding("cron", "Cron Jobs", line.trim()));
    }
  }
  return findings;
}

export function parseKernelExploits(text: string): LinPEASFinding[] {
  const section = extractSection(text, "Kernel") ?? text;
  const findings: LinPEASFinding[] = [];
  const seen = new Set<string>();
  const lines = section.split("\n");

  for (const line of lines) {
    // Extract CVE IDs for deduplication
    const cves = line.match(/CVE-\d{4}-\d{4,}/g) ?? [];
    if (cves.length > 0) {
      const cveId = cves[0];
      if (seen.has(cveId)) continue;
      seen.add(cveId);
    }
    if (/(?:vuln|exploit|CVE-\d{4}-\d{4,})/i.test(line)) {
      findings.push(makeFinding("kernel", "Kernel Exploits", line.trim()));
    }
  }
  return findings;
}

export function parseWritablePaths(text: string): LinPEASFinding[] {
  const section = extractSection(text, "Writable") ?? extractSection(text, "Files") ?? text;
  const findings: LinPEASFinding[] = [];
  const lines = section.split("\n");

  for (const line of lines) {
    // Match lines with world-writable perms (-rw-rw-rw-) or explicit "writable" keyword
    if (/(?:-rw-rw-rw-|-rwxrwxrwx|writable).*(?:\/etc|\/var|\/opt|\/usr\/local|\/srv|\/home)/i.test(line) ||
        /(?:-rw-rw-rw-|-rwxrwxrwx)\s+\S+\s+\S+\s+\S+\s+\S+\s+(\S+)/i.test(line)) {
      findings.push(makeFinding("writable", "Writable Paths", line.trim()));
    }
  }
  return findings;
}

export function parsePasswords(text: string): LinPEASFinding[] {
  const findings: LinPEASFinding[] = [];
  const lines = text.split("\n");

  for (const line of lines) {
    // Look for credential-like content
    if (/(?:password|passwd|hash|secret|token|api.?key)\s*[=:]?\s*\S+/i.test(line) && !/password_file|shadow_file|readable|permission/.test(line)) {
      findings.push(makeFinding("passwords", "Credentials", line.trim()));
    }
    // History files with potential passwords
    if (/\.bash_history|\.zsh_history|\.python_history/.test(line) && /found|readable|writable/i.test(line)) {
      findings.push(makeFinding("passwords", "Credentials", line.trim()));
    }
  }
  return findings;
}

export function parseInterestingFiles(text: string): LinPEASFinding[] {
  const findings: LinPEASFinding[] = [];
  const lines = text.split("\n");

  for (const line of lines) {
    if (/\.git(?:\/config)?\s/i.test(line) && /found|readable|writable/i.test(line)) {
      findings.push(makeFinding("interesting_files", "Interesting Files", line.trim()));
    }
    if (/\.ssh\/id_rsa|\.ssh\/authorized_keys|id_rsa\.pub|id_ed25519/i.test(line)) {
      findings.push(makeFinding("interesting_files", "Interesting Files", line.trim()));
    }
    if (/(?:backup|\.bak|\.old|\.save|\.conf)/i.test(line) && /\/etc\/|\/var\/|\/home/i.test(line)) {
      findings.push(makeFinding("interesting_files", "Interesting Files", line.trim()));
    }
    if (/\.(?:db|sqlite|sql|env)(?:\.\w+)?\s/i.test(line) && /found|readable|writable/i.test(line)) {
      findings.push(makeFinding("interesting_files", "Interesting Files", line.trim()));
    }
  }
  return findings;
}

export function parseSystemInfo(text: string): LinPEASParseResult["system_info"] {
  const info: LinPEASParseResult["system_info"] = {};
  const lines = text.split("\n");

  for (const line of lines) {
    const hostnameMatch = line.match(/(?:hostname|HOSTNAME)[:\s]*(\S+)/i);
    if (hostnameMatch && !info.hostname) info.hostname = hostnameMatch[1].trim();

    const osMatch = line.match(/(?:Operating System|PRETTY_NAME)[:\s]*(.+)/i);
    if (osMatch && !info.os) info.os = osMatch[1].trim().slice(0, 120);

    // Prefer explicit "Kernel Version:" over generic "kernel" in exploit text
    const kernelDirect = line.match(/(?:Kernel Version|Linux version)[:\s]*(\S+)/i);
    const kernelGeneric = line.match(/\bkernel[:\s]+(\S+)/i);
    if (kernelDirect && !info.kernel) {
      info.kernel = kernelDirect[1].trim();
    } else if (kernelGeneric && !info.kernel) {
      info.kernel = kernelGeneric[1].trim();
    }

    const userMatch = line.match(/(?:Current user|USER|whoami)[:\s]+(\S+)/i);
    if (userMatch && !info.user) info.user = userMatch[1].trim();

    const groupsMatch = line.match(/(?:groups|Groups)[:=]\s*(.+)/i);
    if (groupsMatch && !info.groups && !groupsMatch[1].includes("...")) {
      info.groups = groupsMatch[1].trim().split(/[,\s]+/).filter(Boolean).slice(0, 20);
    }
  }

  return info;
}

// ---------------------------------------------------------------------------
// Parser — main entry point
// ---------------------------------------------------------------------------

export function parseLinPEASOutput(
  text: string,
  options?: { filterSeverity?: string; filterType?: string },
): LinPEASParseResult {
  const allFindings: LinPEASFinding[] = [
    ...parseSUID(text),
    ...parseCapabilities(text),
    ...parseSudoRules(text),
    ...parseCronJobs(text),
    ...parseKernelExploits(text),
    ...parseWritablePaths(text),
    ...parsePasswords(text),
    ...parseInterestingFiles(text),
  ];

  // Deduplicate by title+detail (first 100 chars)
  const seen = new Set<string>();
  const findings = allFindings.filter((f) => {
    const key = `${f.type}:${(f.detail.slice(0, 100))}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Summary is based on unfiltered findings
  const bySeverity: Record<string, number> = {};
  const byType: Record<string, number> = {};
  for (const f of findings) {
    bySeverity[f.severity] = (bySeverity[f.severity] ?? 0) + 1;
    byType[f.type] = (byType[f.type] ?? 0) + 1;
  }

  // Apply filters to the findings array
  const minSeverity = SEVERITY_ORDER[options?.filterSeverity ?? "info"] ?? 0;
  const filtered = findings.filter((f) => (SEVERITY_ORDER[f.severity] ?? 0) >= minSeverity);
  const byTypeFilter = options?.filterType;
  const final = byTypeFilter ? filtered.filter((f) => f.type === byTypeFilter) : filtered;

  return {
    summary: {
      total_findings: findings.length,
      by_severity: bySeverity,
      by_type: byType,
    },
    system_info: parseSystemInfo(text),
    findings: final,
  };
}

// ---------------------------------------------------------------------------
// Extension factory
// ---------------------------------------------------------------------------

export default async function piLinpeasExtension(pi: ExtensionAPI) {
  if (DISABLED) return;

  // =======================================================================
  // linpeas_deploy
  // =======================================================================

  pi.registerTool({
    name: "linpeas_deploy",
    label: "LinPEAS: deploy",
    description:
      "Download linPEAS from GitHub releases (or use cached copy), then construct " +
      "the shell commands needed to upload and execute it on a target. Returns the " +
      "local script path and the exec command for the agent to run via the available " +
      "transport (SSH, Sliver exec, MSF session command).",
    parameters: Type.Object({
      variant: Type.Optional(Type.Union(
        [Type.Literal("linpeas.sh"), Type.Literal("linpeas_small.sh")],
        { description: "Which variant to download. linpeas.sh is full (~1MB), linpeas_small.sh is trimmed (~79KB)", default: "linpeas.sh" },
      )),
      remote_path: Type.Optional(Type.String({ description: "Remote directory for upload (default: /tmp)", default: "/tmp" })),
      output_file: Type.Optional(Type.String({ description: "Remote output file path (default: /tmp/linpeas_output.txt)", default: "/tmp/linpeas_output.txt" })),
      extra_args: Type.Optional(Type.String({ description: "Additional linPEAS flags (default: none). Already includes -q -N -a", default: "" })),
    }),
    async execute(_id, p) {
      try {
        const dir = ensureCacheDir();
        const variant = p.variant ?? "linpeas.sh";
        const { localPath, cached } = await downloadLinPEAS({ variant, cacheDir: dir });

        const remotePath = p.remote_path ?? "/tmp";
        const outputFile = p.output_file ?? "/tmp/linpeas_output.txt";
        const extraArgs = p.extra_args ?? "";

        const execCommand = `cd ${remotePath} && chmod +x ${variant} && ./${variant} -q -N -a ${extraArgs} > ${outputFile} 2>&1 &`;

        return jsonResult({
          local_path: localPath,
          variant,
          cached,
          remote_path: `${remotePath}/${variant}`,
          output_file: outputFile,
          exec_command: execCommand,
          upload_instruction: `Upload ${localPath} to ${remotePath}/${variant} on the target`,
          notes: "linPEAS is running in background. Wait 2-5 minutes, then use linpeas_results to collect the output.",
        });
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  // =======================================================================
  // linpeas_results
  // =======================================================================

  pi.registerTool({
    name: "linpeas_results",
    label: "LinPEAS: results",
    description:
      "Retrieve linPEAS output from the target. Pass raw_output if already captured " +
      "(e.g. from SSH stdout), or specify the remote output file path to get " +
      "the download/copy command.",
    parameters: Type.Object({
      raw_output: Type.Optional(Type.String({ description: "Raw linPEAS output text, if already captured" })),
      remote_output_file: Type.Optional(Type.String({ description: "Remote output file path (default: /tmp/linpeas_output.txt)", default: "/tmp/linpeas_output.txt" })),
    }),
    async execute(_id, p) {
      try {
        if (p.raw_output) {
          const dir = ensureCacheDir();
          const ts = new Date().toISOString().replace(/[:.]/g, "-");
          const savedPath = join(dir, `linpeas_output_${ts}.txt`);
          writeFileSync(savedPath, p.raw_output, "utf8");
          return textResult(p.raw_output, { saved_path: savedPath, bytes: p.raw_output.length });
        }

        const outputFile = p.remote_output_file ?? "/tmp/linpeas_output.txt";
        return jsonResult({
          remote_output_file: outputFile,
          download_instruction: `Read ${outputFile} from the target and pass the contents as raw_output to linpeas_results, or run: cat ${outputFile}`,
        });
      } catch (e) {
        return errorResult(e);
      }
    },
  });

  // =======================================================================
  // linpeas_parse
  // =======================================================================

  pi.registerTool({
    name: "linpeas_parse",
    label: "LinPEAS: parse",
    description:
      "Parse raw linPEAS output into structured findings. Extracts SUID/SGID binaries, " +
      "capabilities, writable paths, sudo rules, cron jobs, kernel exploits, interesting " +
      "files, credentials, and other privesc vectors. Categorizes by severity and type.",
    parameters: Type.Object({
      raw_output: Type.String({ description: "The raw linPEAS output text to parse" }),
      filter_severity: Type.Optional(Type.Union(
        [Type.Literal("critical"), Type.Literal("high"), Type.Literal("medium"), Type.Literal("low"), Type.Literal("info")],
        { description: "Only return findings at or above this severity", default: "info" },
      )),
      filter_type: Type.Optional(Type.String({ description: "Only return findings of this type (suid, capabilities, sudo, cron, kernel, writable, passwords, interesting_files)", default: "" })),
    }),
    async execute(_id, p) {
      try {
        const result = parseLinPEASOutput(p.raw_output, {
          filterSeverity: p.filter_severity,
          filterType: p.filter_type,
        });
        return jsonResult(result);
      } catch (e) {
        return errorResult(e);
      }
    },
  });
}
