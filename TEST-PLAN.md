# Pi Pen Kit — Integration Test Plan

## Prerequisites

### Environment
- **Excalibur** (BlackArch, 192.168.1.103): Pi agent host with msfrpcd + sliver-server
- **Oracle** (192.168.1.106): LLM server running qwopus-v2 via llama-swap on RTX 3090
- **HTB target**: kobold.htb (10.129.245.50) — confirmed RCE via MCPJam Inspector

### Setup Instructions

#### 1. pi-metasploit setup on excalibur

```bash
# Clone repo
git clone https://github.com/Cyb3rDudu/pi-pen-kit.git ~/src/pi-pen-kit

# Install deps
cd ~/src/pi-pen-kit/msf-script && npm install
cd ~/src/pi-pen-kit/pi-metasploit && npm install

# Start msfrpcd (systemd service should be running)
sudo systemctl start msfrpcd
# Verify: ss -tlnp | grep 55553

# Configure pi settings (~/.pi/agent/settings.json)
# Add to "packages" array:
#   "../../src/pi-pen-kit/pi-metasploit"

# Set environment vars — add to ~/.bashrc or export before pi:
# export MSF_PASSWORD=<password from /etc/msf/msfrpc.env>
# export MSF_SSL=false
# export MSF_HOST=127.0.0.1
# export MSF_PORT=55553
```

#### 2. pi-sliver setup on excalibur

```bash
cd ~/src/pi-pen-kit/sliver-script && npm install
cd ~/src/pi-pen-kit/pi-sliver && npm install

# Start sliver-server
sudo systemctl start sliver  # or: sliver-server daemon

# Generate operator config (first time only)
# In sliver console: operators --name dudu --lhost 127.0.0.1 --save ~/sliver.cfg
# Then: mkdir -p ~/.sliver-client/configs && cp ~/sliver.cfg ~/.sliver-client/configs/

# Configure pi settings (~/.pi/agent/settings.json)
# Add to "packages" array:
#   "../../src/pi-pen-kit/pi-sliver"

# Set environment vars (optional):
# export PI_SLIVER_CONFIG=~/.sliver-client/configs/dudu.cfg
# export PI_SLIVER_DOWNLOAD_DIR=/tmp/pi-sliver
```

#### 3. Run pi with both extensions

```bash
# Verify extensions load
pi  # Should show pi-metasploit and pi-sliver in [Extensions]

# Non-interactive test run:
MSF_PASSWORD=<pass> MSF_SSL=false pi --provider oracle --model qwopus-v2 \
  -p --append-system-prompt /path/to/prompt.md "your instruction"
```

---

## Test Plan

### Phase 1: pi-metasploit — Individual Tool Tests

Run each tool via pi `-p` mode. Each test is a separate pi invocation that calls one specific MSF tool.

| # | Tool | Test Command | Expected Result |
|---|------|-------------|-----------------|
| M1 | `msf_version` | "Run msf_version and report the output" | Returns version object with version, ruby, api fields |
| M2 | `msf_status` | "Run msf_status and report the output" | Returns version, module counts, 0 sessions, 0 jobs |
| M3 | `msf_search_exploits` | 'Run msf_search_exploits with search "smb"' | Returns filtered list containing windows/smb modules |
| M4 | `msf_search_payloads` | 'Run msf_search_payloads with search "meterpreter/reverse_tcp"' | Returns matching payload list |
| M5 | `msf_module_info` | 'Run msf_module_info for exploit type "multi/handler"' | Returns description, options, references |
| M6 | `msf_start_listener` | Start multi/handler with linux/x64/meterpreter/reverse_tcp on 10.10.14.175:4444 | Returns job_id > 0 |
| M7 | `msf_jobs` | "Run msf_jobs" | Lists the handler job from M6 |
| M8 | `msf_generate_payload` | Generate linux/x64/meterpreter/reverse_tcp as elf | Returns payload info |
| M9 | `msf_sessions` (after exploit) | "Run msf_sessions" | Lists active session(s) |
| M10 | `msf_session_command` | Run "cat /etc/hostname" on the session | Returns target hostname |
| M11 | `msf_session_stop` | Stop the session | Returns success |
| M12 | `msf_job_stop` | Stop the handler job | Returns success |
| M13 | `msf_console` | Run "db_nmap -sV 10.129.245.50 -p 22,80,443" | Returns nmap output |
| M14 | `msf_run_exploit` | Run exploit via module execute | Returns job_id + uuid |
| M15 | `msf_module_results` | Get results from M14 uuid | Returns exploit result |

### Phase 2: pi-metasploit — Full Exploit Chain

Using the confirmed RCE on kobold.htb, test the complete flow:

1. `msf_start_listener` — meterpreter reverse TCP on 10.10.14.175:4444
2. Generate payload via bash (`msfvenom`)
3. Serve payload via bash (python http.server)
4. Trigger RCE via bash (`curl` to mcp.kobold.htb)
5. `msf_sessions` — verify session
6. `msf_session_command` — run `whoami`, `cat /home/*/user.txt`
7. `msf_session_stop` — cleanup

### Phase 3: pi-sliver — Individual Tool Tests

| # | Tool | Test Command | Expected Result |
|---|------|-------------|-----------------|
| S1 | `sliver_version` | "Run sliver_version" | Returns server version |
| S2 | `sliver_status` | "Run sliver_status" | Returns config path, version, counts |
| S3 | `sliver_sessions` | "Run sliver_sessions" | Lists active sessions (may be empty) |
| S4 | `sliver_beacons` | "Run sliver_beacons" | Lists beacons |
| S5 | `sliver_jobs` | "Run sliver_jobs" | Lists active listeners |
| S6 | `sliver_operators` | "Run sliver_operators" | Lists operators |
| S7 | `sliver_listener_mtls` | Start mTLS on 0.0.0.0:4444 | Returns job ID |
| S8 | `sliver_implant_generate` | Generate linux/amd64 implant with mtls://10.10.14.175:4444 | Returns local path + size |
| S9 | `sliver_implants` | "Run sliver_implants" | Lists the generated implant |
| S10 | `sliver_upload` + `sliver_exec` | Upload implant to target, chmod +x, execute | Implant calls back |
| S11 | `sliver_exec` | Run whoami on session | Returns username |
| S12 | `sliver_pwd` | Get working directory | Returns path |
| S13 | `sliver_ls` | List /home | Returns directory listing |
| S14 | `sliver_cat` | Read /home/*/user.txt | Returns user flag |
| S15 | `sliver_ps` | Process list | Returns running processes |
| S16 | `sliver_ifconfig` | Network interfaces | Returns interface info |
| S17 | `sliver_netstat` | Active connections | Returns connection list |
| S18 | `sliver_download` | Download a file | Returns local path |
| S19 | `sliver_terminate` | Kill a process | Returns success |
| S20 | `sliver_job_kill` | Kill the mTLS listener | Returns success |

### Phase 4: pi-sliver — Full Exploit Chain via Sliver

1. `sliver_listener_mtls` — start mTLS on attacker IP
2. `sliver_implant_generate` — build linux implant
3. Deploy via kobold RCE (upload + execute through bash)
4. `sliver_sessions` — verify session callback
5. `sliver_exec` — run commands
6. `sliver_cat` — read user.txt
7. Cleanup

---

## Known Issue: Schema Error

**Problem:** `Type.Record(Type.String(), Type.Unknown())` in pi-metasploit causes:
```
"The type of key must be string or number but object"
```

**Root cause:** `Type.Unknown()` produces a JSON Schema `{}` which some LLM function calling
implementations can't handle. The OpenAI-compatible tool calling spec requires concrete types
for all properties.

**Fix:** Replace `Type.Record(Type.String(), Type.Unknown())` with `Type.Record(Type.String(), Type.String())`
in all tool parameter definitions. The LLM sends options as string key-value pairs, and the
extension code parses numeric values where needed.

### Affected tools (pi-metasploit):
- `msf_run_exploit` — options parameter
- `msf_run_auxiliary` — options parameter
- `msf_run_post` — options parameter
- `msf_check` — options parameter
- `msf_start_listener` — options parameter
- `msf_generate_payload` — options parameter

---

## Pass/Fail Criteria

- **PASS**: Tool returns valid data, no schema errors, no timeout
- **FAIL**: Schema error, connection error, or unexpected empty result
- **BLOCKED**: External dependency unavailable (sliver-server down, target down)

Each tool test gets logged with:
- Tool name
- Input parameters sent
- Raw output
- PASS/FAIL status
- Error message if failed
