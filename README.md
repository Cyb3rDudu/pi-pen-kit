# pi-pen-kit

Pi extensions for offensive-security workflows — pentesting and red-team tooling built on top of the [Pi](https://pi.dev/) coding agent.

## Extensions

### `pi-sliver` — Sliver C2 as a Pi operator client

Connects the Pi coding agent to a [Sliver](https://sliver.sh/) C2 server through the [`sliver-script`](https://github.com/moloch--/sliver-script) gRPC client, using your existing operator `.cfg`. The agent gets ~25 native tools spanning the operator surface — list/inspect implants, run commands on sessions and beacons, manage listeners, generate and pull implant builds — plus a live event subscription that notifies you when new sessions or beacons check in.

| Tool | Purpose |
|---|---|
| `sliver_status` | One-shot snapshot: version, operators, counts of sessions/beacons/jobs |
| `sliver_version`, `sliver_operators` | Server metadata |
| `sliver_sessions`, `sliver_beacons` | List active implants |
| `sliver_exec` | Run a command on a session or beacon |
| `sliver_ls`, `sliver_pwd`, `sliver_cd`, `sliver_rm`, `sliver_mkdir`, `sliver_cat` | Filesystem ops on the implant |
| `sliver_download`, `sliver_upload` | Move files between operator box and implant |
| `sliver_ps`, `sliver_terminate`, `sliver_netstat`, `sliver_ifconfig` | Host recon / process control |
| `sliver_screenshot` | Capture implant host screen (returns image inline + saved PNG) |
| `sliver_jobs`, `sliver_job_kill` | Server-side job control |
| `sliver_listener_mtls/http/https/dns/wg` | Spin up C2 listeners |
| `sliver_implants`, `sliver_implant_generate`, `sliver_implant_regenerate`, `sliver_implant_delete` | Implant build management |

Custom slash command: `/sliver [status|config|reconnect|disconnect]`.

#### Configuration

Operator config is auto-discovered: the most recently modified `*.cfg` under `~/.sliver-client/configs/` is selected by default. Override with `PI_SLIVER_CONFIG=/path/to/operator.cfg`.

| Variable | Default | Purpose |
|---|---|---|
| `PI_SLIVER_CONFIG` | — | Explicit path to an operator `.cfg`. Overrides auto-discovery. |
| `PI_SLIVER_DISABLE` | — | Any non-empty value disables the extension entirely. |
| `PI_SLIVER_DOWNLOAD_DIR` | `$TMPDIR/pi-sliver` | Local destination for downloads, screenshots, generated implants. |

#### Install

```bash
git clone https://github.com/Cyb3rDudu/pi-pen-kit.git ~/src/pi-pen-kit

# Install the extension's runtime deps (sliver-script + gRPC stack).
cd ~/src/pi-pen-kit/pi-sliver && npm install

# Register the extension with Pi.
mkdir -p ~/.pi/agent/extensions
ln -sfn ~/src/pi-pen-kit/pi-sliver ~/.pi/agent/extensions/pi-sliver
```

Or add the absolute path to the `packages` array in `~/.pi/agent/settings.json`:

```jsonc
{
  "packages": [
    "/Users/you/src/pi-pen-kit/pi-sliver"
    // …
  ]
}
```

Restart Pi. Run `/sliver status` to verify the operator config was picked up and the gRPC connection is live.

#### Live event stream

When connected, the extension subscribes to `client.event$` and surfaces:

- `session-connected` → info notification with hostname, user, OS/arch, remote addr
- `session-disconnected` → warning notification
- `beacon-registered` → info notification
- `job-started` / `job-stopped` → info notifications

Notifications use `ctx.ui.notify` and require an interactive Pi UI (not RPC/print mode).

## Compatibility

- Pi: tested with `@earendil-works/pi-coding-agent` ≥ 0.75 (the active fork of `@mariozechner/pi-coding-agent`)
- Sliver: any server reachable by `sliver-script@1.2.x` (gRPC over mTLS)

## License

MIT
