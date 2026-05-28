# Setup Guide — pi-pen-kit

Complete installation and configuration guide for the pi-metasploit and pi-sliver Pi extensions. Tested on Arch Linux (BlackArch) and macOS.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [pi-metasploit Setup](#pi-metasploit-setup)
- [pi-sliver Setup](#pi-sliver-setup)
- [Using Both Extensions Together](#using-both-extensions-together)
- [Troubleshooting](#troubleshooting)

## Prerequisites

| Dependency | Version | Purpose |
|---|---|---|
| [Pi](https://pi.dev/) | ≥ 0.75 | The coding agent that hosts the extensions |
| Node.js | ≥ 22 | Runtime for Pi extensions |
| Metasploit Framework | ≥ 6.0 | C2 framework (for pi-metasploit) |
| Sliver Server | ≥ 1.7 | C2 framework (for pi-sliver) |

## Installation

```bash
# Clone the repository
git clone https://github.com/Cyb3rDudu/pi-pen-kit.git ~/src/pi-pen-kit

# Install dependencies for both plugins
cd ~/src/pi-pen-kit/msf-script && npm install
cd ~/src/pi-pen-kit/sliver-script && npm install
cd ~/src/pi-pen-kit/pi-metasploit && npm install
cd ~/src/pi-pen-kit/pi-sliver && npm install
```

### Register extensions with Pi

Edit `~/.pi/agent/settings.json` and add both packages to the `packages` array:

```json
{
  "packages": [
    "../../src/pi-pen-kit/pi-metasploit",
    "../../src/pi-pen-kit/pi-sliver"
  ]
}
```

> **Note**: The path is relative to `~/.pi/agent/`. Adjust if you cloned elsewhere. Absolute paths also work.

### Verify extensions load

```bash
pi
# Should show in [Extensions]:
#   pi-metasploit, pi-sliver
```

---

## pi-metasploit Setup

### 1. Start msfrpcd

The Metasploit RPC daemon must be running before Pi starts. Two options:

**Option A: Systemd service (recommended for persistent hosts)**

```bash
# Create environment file
sudo mkdir -p /etc/msf
echo "MSF_PASSWORD=$(openssl rand -hex 32)" | sudo tee /etc/msf/msfrpc.env
sudo chmod 600 /etc/msf/msfrpc.env

# Create systemd unit
sudo tee /etc/systemd/system/msfrpcd.service << 'EOF'
[Unit]
Description=Metasploit RPC Daemon (msgpack on 127.0.0.1:55553)
After=network-online.target

[Service]
Type=simple
EnvironmentFile=/etc/msf/msfrpc.env
ExecStart=/usr/bin/msfrpcd -P ${MSF_PASSWORD} -S -a 127.0.0.1 -p 55553 -f
Restart=on-failure
RestartSec=10
StandardOutput=append:/var/log/msfrpcd.log
StandardError=append:/var/log/msfrpcd.log

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable --now msfrpcd
```

**Option B: Manual (one-shot)**

```bash
msfrpcd -P yourpassword -S -a 127.0.0.1 -p 55553
```

> **Note**: The `-S` flag disables SSL for the RPC connection (msgpack over plain HTTP). This is fine for localhost. Remove `-S` and set `MSF_SSL=true` for remote connections.
>
> If `MSF_SSL` is **not** explicitly set, the extension auto-detects: it tries the default SSL setting first, and if the connection times out (5 s), it automatically retries with the opposite setting. For instant connection, set `MSF_SSL=false` explicitly when using `-S`.

### 2. Configure environment variables

Add to `~/.bashrc` or export before starting Pi:

```bash
export MSF_PASSWORD="yourpassword"       # Required — must match msfrpcd -P
export MSF_HOST="127.0.0.1"             # Default: 127.0.0.1
export MSF_PORT="55553"                  # Default: 55553
export MSF_SSL="false"                   # Default: true (set false if msfrpcd uses -S)
export MSF_DOWNLOAD_DIR="/tmp/pi-metasploit"  # Where generated payloads are saved
```

### 3. Verify connection

```bash
MSF_PASSWORD=yourpassword MSF_SSL=false pi -p "Run msf_version and report the output."
```

Expected: Metasploit version, Ruby version, API version.

### Available Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `MSF_HOST` | `127.0.0.1` | msfrpcd host |
| `MSF_PORT` | `55553` | msfrpcd port |
| `MSF_PASSWORD` | — | **Required** — RPC password |
| `MSF_USERNAME` | `msf` | RPC username |
| `MSF_SSL` | `true` | Use HTTPS for RPC |
| `MSF_DISABLE` | — | Any non-empty value disables the extension |
| `MSF_DOWNLOAD_DIR` | `$TMPDIR/pi-metasploit` | Local dir for generated payloads |

---

## pi-sliver Setup

### 1. Start Sliver server

```bash
# Option A: Systemd service
sudo systemctl enable --now sliver

# Option B: Manual
sliver-server daemon --lhost 127.0.0.1 --lport 31337
```

### 2. Generate an operator config

If you don't already have one:

```bash
# In the Sliver console:
sliver-server
# > operators --name dudu --lhost 127.0.0.1 --save ~/operator.cfg

# Move to the auto-discovery directory
mkdir -p ~/.sliver-client/configs
mv ~/operator.cfg ~/.sliver-client/configs/dudu_localhost.cfg
```

The extension auto-discovers the most recently modified `*.cfg` in `~/.sliver-client/configs/`.

### 3. (Optional) Set up a cross-compiler

Sliver needs an external Go cross-compiler for building implants. Register one:

```bash
sliver-server
# > builders
# Follow the prompts to register a builder
```

Or use the built-in builder daemon:

```bash
sliver-server builder -c ~/.sliver-builder/configs/builder-localhost.cfg
```

### 4. Configure environment variables (optional)

```bash
export PI_SLIVER_CONFIG="$HOME/.sliver-client/configs/dudu_localhost.cfg"
export PI_SLIVER_DOWNLOAD_DIR="/tmp/pi-sliver"
```

### 5. Verify connection

```bash
pi -p "Run sliver_version and report the output."
```

Expected: Sliver version, commit hash, build OS/arch.

### Available Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `PI_SLIVER_CONFIG` | Auto-discovered | Path to operator `.cfg` |
| `PI_SLIVER_DISABLE` | — | Any non-empty value disables the extension |
| `PI_SLIVER_DOWNLOAD_DIR` | `$TMPDIR/pi-sliver` | Local dir for downloads, screenshots, implants |

---

## Using Both Extensions Together

### Typical pentest workflow

1. **Recon** — Use Pi's built-in `bash` tool for nmap, ffuf, etc.
2. **Exploit** — Use `msf_run_exploit` or manual RCE via `bash`
3. **Persist** — Deploy a Sliver implant via `sliver_implant_generate` + upload through the initial access
4. **Post-exploit** — Use `sliver_exec`, `sliver_cat`, `sliver_download` on the Sliver session/beacon
5. **Lateral movement** — Use `msf_run_post` or `sliver_upload` to move tools to other hosts

### Example: Non-interactive exploitation

```bash
# Start Pi with both extensions, model, and a prompt
MSF_PASSWORD=yourpassword \
MSF_SSL=false \
PI_SLIVER_CONFIG=~/.sliver-client/configs/dudu.cfg \
pi --provider oracle --model qwopus-v2 \
  -p --append-system-prompt /path/to/mission.md \
  "Execute the full exploitation chain."
```

### Example: Interactive session with notifications

In interactive mode (`pi` without `-p`), both extensions show live notifications:
- `[metasploit] handler started on 10.10.14.175:4444`
- `[sliver] new session FRIENDLY_TENEMENT → ben@kobold.htb (linux/amd64)`
- `[sliver] session abc12345 disconnected`

---

## Troubleshooting

### "The type of key must be string or number but object"

This was a bug in msf-script where msfrpcd sends msgpack binary-encoded string keys. **Fixed in msf-script v1.0.0+** — if you see this, update:

```bash
cd ~/src/pi-pen-kit && git pull
cd msf-script && npm install
```

### "pi-sliver: no Sliver operator config found"

Either:
1. Place a `.cfg` file under `~/.sliver-client/configs/`
2. Set `PI_SLIVER_CONFIG` to the path of your operator config

### "MSF_PASSWORD env var is required"

Set the `MSF_PASSWORD` environment variable before starting Pi. It must match the password you passed to `msfrpcd -P`.

### Beacon operations timeout

Beacon implants check in asynchronously (every 5-60 seconds). Tool calls against beacons may take up to 2× the beacon interval to return. This is expected behavior — see GitHub issues #2 and #4 for planned improvements.

### msfrpcd connection refused

```bash
# Check if msfrpcd is running
ss -tlnp | grep 55553
sudo systemctl status msfrpcd

# Check the password
sudo cat /etc/msf/msfrpc.env
```

### Tool calls hang / timeout (30 s)

This happens when `MSF_SSL` doesn't match msfrpcd's SSL setting. The most common cause: msfrpcd was started with `-S` (no SSL, plain HTTP) but `MSF_SSL` is not set (defaults to `true`). Every RPC call tries HTTPS against an HTTP server and times out.

**Fix** — export `MSF_SSL=false` in your shell **before** starting Pi:

```bash
export MSF_SSL=false
```

Or, if you use multiple shells, add the export to all env config files:

```bash
# bash
echo 'export MSF_SSL=false' >> ~/.bashrc.d/00-env.bash

# zsh
echo 'export MSF_SSL=false' >> ~/.zshrc.d/00-env.zsh

# fish
echo 'set -gx MSF_SSL false' >> ~/.config/fish/conf.d/00-env.fish
```

> **Note**: You must log out and log back in (or start a new shell) for the change to take effect. The extension also has an SSL auto-detect fallback (5 s probe), so an explicit `MSF_SSL=false` is recommended for instant connection.
