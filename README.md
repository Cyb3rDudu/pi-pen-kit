<p align="center">
  <img src="assets/logo.png" alt="pi-pen-kit logo" width="200" />
</p>

<h1 align="center">pi-pen-kit</h1>

<p align="center">
  <strong>Pi extensions for offensive-security workflows</strong><br>
  Pentesting and red-team tooling built on top of the <a href="https://pi.dev/">Pi</a> coding agent.
</p>

---

## What's inside

| Package | Type | Description |
|---|---|---|
| [`pi-sliver`](./pi-sliver/README.md) | Pi extension | [Sliver](https://sliver.sh/) C2 operator client — 25 tools for sessions, beacons, listeners, implants |
| [`pi-metasploit`](./pi-metasploit/README.md) | Pi extension | [Metasploit](https://www.metasploit.com/) RPC operator client — 22 tools for exploits, sessions, payloads |
| [`sliver-script`](./sliver-script/README.md) | Library | Sliver gRPC client for Node.js (fork of [sliverarmory/sliver-script](https://github.com/sliverarmory/sliver-script)) |
| [`msf-script`](./msf-script/README.md) | Library | Metasploit RPC client for Node.js (HTTP + MessagePack) |

## Quick start

```bash
git clone https://github.com/Cyb3rDudu/pi-pen-kit.git ~/src/pi-pen-kit

# Install dependencies
cd ~/src/pi-pen-kit/pi-sliver && npm install
cd ~/src/pi-pen-kit/pi-metasploit && npm install

# Register extensions with Pi
# Add to ~/.pi/agent/settings.json → packages array:
#   "../../src/pi-pen-kit/pi-sliver"
#   "../../src/pi-pen-kit/pi-metasploit"
```

Restart Pi. The extensions auto-connect to their respective C2 servers on startup.

## Compatibility

- **Pi**: `@earendil-works/pi-coding-agent` ≥ 0.75
- **Sliver**: v1.7+ (gRPC over mTLS)
- **Metasploit**: msfrpcd (HTTP + MessagePack RPC)

## License

MIT
