# pi-sliver

Sliver C2 operator client as a [Pi](https://pi.dev/) extension.

Connects the Pi coding agent to a [Sliver](https://sliver.sh/) C2 server through the [`sliver-script`](../sliver-script/) gRPC client, using your existing operator `.cfg`. The agent gets 25 native tools spanning the full operator surface — plus a live event stream for session/beacon notifications.

## Tools

### Server discovery
| Tool | Purpose |
|---|---|
| `sliver_version` | Server version, git commit, build info |
| `sliver_status` | One-shot snapshot: version, operators, session/beacon/job counts |
| `sliver_operators` | List connected operators |
| `sliver_sessions` | List active interactive sessions |
| `sliver_beacons` | List asynchronous beacon implants |

### Implant interaction
| Tool | Purpose |
|---|---|
| `sliver_exec` | Run a command on a session or beacon (blocks for result) |
| `sliver_ls` | List directory on the implant |
| `sliver_pwd` | Current working directory |
| `sliver_cd` | Change directory |
| `sliver_cat` | Read a small text file inline |
| `sliver_rm` | Delete file or directory |
| `sliver_mkdir` | Create directory |
| `sliver_download` | Download file from implant to operator box |
| `sliver_upload` | Upload file from operator box to implant |
| `sliver_ps` | Process list |
| `sliver_ifconfig` | Network interfaces |
| `sliver_netstat` | Active connections |
| `sliver_terminate` | Kill a process by PID |
| `sliver_screenshot` | Capture screen (returns image + saves PNG) |

### Jobs & listeners
| Tool | Purpose |
|---|---|
| `sliver_jobs` | List server-side jobs (listeners) |
| `sliver_job_kill` | Stop a job |
| `sliver_listener_mtls` | Start mTLS listener |
| `sliver_listener_http` | Start HTTP listener |
| `sliver_listener_https` | Start HTTPS listener |
| `sliver_listener_dns` | Start DNS listener |
| `sliver_listener_wg` | Start WireGuard listener |

### Implant builds
| Tool | Purpose |
|---|---|
| `sliver_implants` | List built implants |
| `sliver_implant_generate` | Generate a new implant |
| `sliver_implant_regenerate` | Rebuild an existing implant |
| `sliver_implant_delete` | Delete an implant build |

## Beacon blocking

All interactive tools transparently block when targeting a **beacon** implant — the call waits for the beacon to check in and return the result before responding. This matches the behavior of session commands, so you can use the same tool calls regardless of implant type.

## Live event stream

When connected, the extension subscribes to the Sliver event stream and surfaces notifications:

- **Session connected** → info notification with hostname, user, OS/arch
- **Session disconnected** → warning notification
- **Beacon registered** → info notification
- **Job started/stopped** → info notifications

## Configuration

Operator config is auto-discovered: the most recently modified `*.cfg` under `~/.sliver-client/configs/` is used by default.

| Variable | Default | Purpose |
|---|---|---|
| `PI_SLIVER_CONFIG` | auto-discovered | Explicit path to operator `.cfg` |
| `PI_SLIVER_DISABLE` | — | Any non-empty value disables the extension |
| `PI_SLIVER_DOWNLOAD_DIR` | `$TMPDIR/pi-sliver` | Local dir for downloads, screenshots, implants |

## Tests

```bash
cd pi-sliver && npx vitest run   # 29 unit tests
```

## License

MIT
