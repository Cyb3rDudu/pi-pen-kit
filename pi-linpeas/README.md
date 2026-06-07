# pi-linpeas

linPEAS privilege escalation enumeration as a [Pi](https://pi.dev/) extension.

Automates the full linPEAS workflow for Linux privesc after gaining initial shell access: download the script from GitHub, deploy it to the target via any available transport (SSH, Sliver exec, MSF session_command), collect the output, and parse the massive colored text into structured, severity-ranked findings.

## Architecture

Transport-agnostic — no dependency on `msf-script` or `sliver-script`. The extension constructs the shell commands and the Pi agent executes them via whatever transport is available.

## Tools

| Tool | Purpose |
|---|---|
| `linpeas_deploy` | Download linPEAS from GitHub releases (cached locally), return local path + deploy commands for the agent |
| `linpeas_results` | Retrieve linPEAS output from the target — accepts raw text directly or returns download instructions |
| `linpeas_parse` | Parse raw linPEAS output into structured findings with severity classification |

## Workflow

```
linpeas_deploy  →  agent uploads + executes on target
       ↓
linpeas_results  →  collect raw output
       ↓
linpeas_parse  →  structured findings
```

### linpeas_deploy

Downloads the chosen variant from GitHub releases, caches it locally, and constructs the upload + exec command.

| Parameter | Default | Purpose |
|---|---|---|
| `variant` | `linpeas.sh` | `linpeas.sh` (full, ~1 MB) or `linpeas_small.sh` (trimmed, ~79 KB) |
| `remote_path` | `/tmp` | Remote directory for upload |
| `output_file` | `/tmp/linpeas_output.txt` | Remote file to redirect output into |
| `extra_args` | — | Additional linPEAS flags (already includes `-q -N -a`) |

Returns: `local_path`, `remote_path`, `output_file`, `exec_command`, `upload_instruction`

### linpeas_results

Either accepts raw output text directly (from SSH stdout), or returns instructions to download the output file.

| Parameter | Default | Purpose |
|---|---|---|
| `raw_output` | — | Raw linPEAS output text, if already captured |
| `remote_output_file` | `/tmp/linpeas_output.txt` | Remote output file path |

### linpeas_parse

Parses raw linPEAS text into structured findings.

| Parameter | Default | Purpose |
|---|---|---|
| `raw_output` | — | Raw linPEAS output text |
| `filter_severity` | `info` | Minimum severity: `critical`, `high`, `medium`, `low`, `info` |
| `filter_type` | — | Only return findings of this type |

## Parser output

```json
{
  "summary": { "total_findings": 14, "by_severity": {"critical": 2, "high": 4}, "by_type": {"suid": 3} },
  "system_info": { "hostname": "web01", "os": "Ubuntu 22.04", "kernel": "5.15.0-91", "user": "www-data" },
  "findings": [{ "type": "suid", "severity": "high", "title": "/opt/recon/bin/recon-shell", "detail": "...", "section": "SUID/SGID Binaries" }]
}
```

### Finding types

| Type | What it extracts |
|---|---|
| `suid` | SUID/SGID binaries (non-standard = high severity) |
| `capabilities` | File capabilities (`cap_setuid`, `cap_dac_override`, etc.) |
| `sudo` | `NOPASSWD`, `SETENV`, `NOEXEC` sudo rules |
| `cron` | Writable cron configurations and suspicious cron jobs |
| `kernel` | Kernel version exploits and CVE references |
| `writable` | World-writable paths in sensitive directories (`/etc`, `/var`, `/opt`) |
| `passwords` | Credentials found in env files, history files, config files |
| `interesting_files` | SSH keys, database backups, writable configs, git directories |

### Severity levels

| Level | Examples |
|---|---|
| **critical** | Writable `/etc/shadow`, `NOPASSWD ALL`, docker socket, plaintext passwords |
| **high** | GTFOBins SUID, `cap_setuid`/`cap_dac_override`, writable `/etc/sudoers` |
| **medium** | Writable cron configs, kernel version exploits, writable service files |
| **low** | Standard SUID binaries (`nmap`, `vim`, `find`), standard capability listings |
| **info** | System info, version strings |

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `PI_LINPEAS_DISABLE` | — | Any non-empty value disables the extension |
| `PI_LINPEAS_CACHE_DIR` | `$TMPDIR/pi-linpeas` | Local directory for cached linPEAS downloads |
| `PI_LINPEAS_VERSION` | `latest` | GitHub release tag to download |

## Tests

```bash
cd pi-linpeas && npx vitest run   # 23 unit tests (parser + classifier)
```

## License

MIT
