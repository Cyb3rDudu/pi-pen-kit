import { describe, it, expect } from "vitest";
import {
  filterModules,
  parseOptionsString,
  sessionSummary,
} from "./index";

// ---------------------------------------------------------------------------
// filterModules()
// ---------------------------------------------------------------------------
describe("filterModules", () => {
  const modules = [
    "windows/smb/ms17_010_psexec",
    "windows/smb/psexec",
    "unix/ftp/vsftpd_234_backdoor",
    "linux/http/apache_mod_cgi_bash_env_exec",
    "multi/handler",
    "windows/browser/ms14_012_telerik_ui",
  ];

  it("returns first `limit` modules when no search term", () => {
    const result = filterModules(modules, "");
    expect(result).toEqual(modules.slice(0, 50));
  });

  it("filters by case-insensitive search term", () => {
    const result = filterModules(modules, "smb");
    expect(result).toEqual([
      "windows/smb/ms17_010_psexec",
      "windows/smb/psexec",
    ]);
  });

  it("respects the limit parameter", () => {
    const result = filterModules(modules, "", 2);
    expect(result).toHaveLength(2);
  });

  it("returns empty for non-matching term", () => {
    expect(filterModules(modules, "android")).toEqual([]);
  });

  it("matches partial strings", () => {
    const result = filterModules(modules, "vsftpd");
    expect(result).toEqual(["unix/ftp/vsftpd_234_backdoor"]);
  });

  it("handles empty module list", () => {
    expect(filterModules([], "smb")).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// parseOptionsString()
// ---------------------------------------------------------------------------
describe("parseOptionsString", () => {
  it("parses KEY=VAL pairs", () => {
    expect(parseOptionsString("LHOST=10.10.14.5,LPORT=4444")).toEqual({
      LHOST: "10.10.14.5",
      LPORT: "4444",
    });
  });

  it("handles spaces around keys and values", () => {
    expect(parseOptionsString(" LHOST = 10.10.14.5 , LPORT = 4444 ")).toEqual({
      LHOST: "10.10.14.5",
      LPORT: "4444",
    });
  });

  it("skips pairs without =", () => {
    expect(parseOptionsString("LHOST=10.10.14.5,badpair,LPORT=4444")).toEqual({
      LHOST: "10.10.14.5",
      LPORT: "4444",
    });
  });

  it("handles values with = in them", () => {
    expect(parseOptionsString("KEY=val=ue")).toEqual({
      KEY: "val=ue",
    });
  });

  it("returns empty object for empty string", () => {
    expect(parseOptionsString("")).toEqual({});
  });

  it("handles values with colons (IP:port)", () => {
    expect(parseOptionsString("RHOSTS=10.10.10.5:8080")).toEqual({
      RHOSTS: "10.10.10.5:8080",
    });
  });
});

// ---------------------------------------------------------------------------
// sessionSummary()
// ---------------------------------------------------------------------------
describe("sessionSummary", () => {
  const baseSession = {
    type: "meterpreter",
    tunnel_local: "10.10.14.5:4444",
    tunnel_peer: "10.10.10.5:49321",
    via_exploit: "exploit/windows/smb/psexec",
    via_payload: "payload/windows/meterpreter/reverse_tcp",
    desc: "Meterpreter",
    info: "NT AUTHORITY\\SYSTEM @ DC1",
    workspace: "default",
    session_host: "10.10.10.5",
    session_port: 445,
    target_host: "10.10.10.5",
    username: "root",
    uuid: "abc123",
    exploit_uuid: "def456",
    routes: [] as string[],
    arch: "x64",
    platform: "windows",
  };

  it("produces a readable summary string", () => {
    const result = sessionSummary("1", baseSession);
    expect(result).toBe("[#1] meterpreter — NT AUTHORITY\\SYSTEM @ DC1 (windows/x64) from 10.10.10.5");
  });

  it("falls back to desc when info is empty", () => {
    const s = { ...baseSession, info: "" };
    const result = sessionSummary("2", s);
    expect(result).toContain("Meterpreter");
  });

  it("falls back to session_host when target_host is empty", () => {
    const s = { ...baseSession, target_host: "" };
    const result = sessionSummary("3", s);
    expect(result).toContain("from 10.10.10.5");
  });

  it("handles shell type", () => {
    const s = { ...baseSession, type: "shell", desc: "Command shell", info: "" };
    const result = sessionSummary("4", s);
    expect(result).toContain("shell");
    expect(result).toContain("Command shell");
  });
});
