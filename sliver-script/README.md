# sliver-script

Sliver C2 gRPC client for Node.js — fork of [sliverarmory/sliver-script](https://github.com/sliverarmory/sliver-script) with blocking beacon support.

Used by [`pi-sliver`](../pi-sliver/) to talk to a Sliver server over gRPC + mTLS.

## What changed from upstream

- **Blocking beacon commands**: All `InteractiveBeacon` methods (`execute`, `pwd`, `cd`, `rm`, `mkdir`, `download`, `upload`, `ps`, `ifconfig`, `netstat`, `terminate`, `screenshot`) now block and wait for the beacon to check in before returning results. Uses a generic `queueTask()` helper that mirrors the existing `lsTask()` pattern.
- **Module resolution**: Uses `nice-grpc` (pure JS gRPC client) instead of the native `@grpc/grpc-js`, making it compatible with Pi's module resolver.
- **Compiled lib/ committed**: The `lib/` directory is committed to the repo so `npm install` from a `file:` reference works without a build step.

## Usage

```typescript
import { SliverClient, ParseConfigFile } from "sliver-script";

const config = await ParseConfigFile("~/.sliver-client/configs/myserver.cfg");
const client = new SliverClient(config);
await client.connect();

const sessions = await client.sessions();
const beacon = client.interactBeacon(beaconId);

// Beacon commands now block!
const result = await beacon.execute("/usr/bin/whoami");
console.log(result.Stdout); // "root\n"
```

## Tests

```bash
cd sliver-script && npx vitest run   # 14 unit tests (config parsing)
```

## License

BSD-3-Clause (original), modifications MIT.
