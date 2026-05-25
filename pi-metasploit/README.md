# pi-metasploit

Metasploit C2 operator client as a [Pi](https://pi.dev/) extension.

Exposes the Metasploit RPC API (msfrpcd) to the Pi coding agent as native tools. Covers module management, exploit/auxiliary/post execution, session interaction (shell + meterpreter), job management, and console access. Built on [`msf-script`](../msf-script/).

Replaces the Python MCP server (`MetasploitMCP`) with a native Pi extension — no SSE transport, no separate process, no MCP adapter needed.

## Tools

### Core
| Tool | Purpose |
|---|---|
| `msf_version` | Framework version, Ruby version, API version |
| `msf_status` | One-shot snapshot: version, module counts, sessions, jobs |

### Modules
| Tool | Purpose |
|---|---|
| `msf_search_exploits` | Search exploit modules |
| `msf_search_auxiliary` | Search auxiliary modules (scanners, fuzzers, admin) |
| `msf_search_post` | Search post-exploitation modules |
| `msf_search_payloads` | Search payload modules |
| `msf_module_info` | Detailed info + options for a module |
| `msf_compatible_payloads` | Payloads compatible with an exploit |

### Execution
| Tool | Purpose |
|---|---|
| `msf_run_exploit` | Run an exploit module (async, returns job_id + uuid) |
| `msf_run_auxiliary` | Run an auxiliary module |
| `msf_run_post` | Run a post module against a session |
| `msf_check` | Check if a target is vulnerable |
| `msf_module_results` | Get results of a completed module run by UUID |
| `msf_running_stats` | Running/waiting/completed module stats |

### Sessions
| Tool | Purpose |
|---|---|
| `msf_sessions` | List active sessions (shell + meterpreter) |
| `msf_session_command` | Send command to session and get output |
| `msf_session_run_script` | Run a post module against a session |
| `msf_session_stop` | Terminate a session |

### Jobs
| Tool | Purpose |
|---|---|
| `msf_jobs` | List active background jobs |
| `msf_job_info` | Details about a specific job |
| `msf_job_stop` | Stop a running job |

### Console & Listeners
| Tool | Purpose |
|---|---|
| `msf_console` | Run any msfconsole command (db_nmap, setg, workspace, etc.) |
| `msf_start_listener` | Start a multi/handler listener |
| `msf_generate_payload` | Generate a standalone payload |

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `MSF_HOST` | `127.0.0.1` | msfrpcd host |
| `MSF_PORT` | `55553` | msfrpcd port |
| `MSF_PASSWORD` | — | **Required** — RPC password (set via `msfrpcd -P`) |
| `MSF_USERNAME` | `msf` | RPC username |
| `MSF_SSL` | `true` | Use HTTPS for RPC |
| `MSF_DISABLE` | — | Any non-empty value disables the extension |

Start msfrpcd before Pi:
```bash
msfrpcd -P yourpassword -S -a 127.0.0.1
```

## Tests

```bash
cd pi-metasploit && npx vitest run   # 16 unit tests
```

## License

MIT
