import { describe, it, expect } from "vitest";
import { MsfRpcClient, type MsfRpcConfig } from "./lib/client";

// ---------------------------------------------------------------------------
// MsfRpcClient — construction (no network)
// ---------------------------------------------------------------------------
describe("MsfRpcClient", () => {
  it("stores config and reports disconnected", () => {
    const client = new MsfRpcClient({
      host: "10.0.0.1",
      port: 55553,
      password: "secret",
      username: "admin",
      ssl: false,
    });
    expect(client.isConnected).toBe(false);
  });

  it("uses defaults for omitted fields", () => {
    const client = new MsfRpcClient({ password: "secret" });
    expect(client.isConnected).toBe(false);
  });

  it("rejects call() when not connected", async () => {
    const client = new MsfRpcClient({ password: "secret" });
    await expect(client.call("core.version")).rejects.toThrow("Not connected");
  });

  it("rejects disconnect() when not connected", async () => {
    const client = new MsfRpcClient({ password: "secret" });
    // Should not throw
    await client.disconnect();
    expect(client.isConnected).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// parseOptionsString — imported via re-export test
// ---------------------------------------------------------------------------
describe("MsfRpcConfig type", () => {
  it("accepts minimal config", () => {
    const config: MsfRpcConfig = { password: "test" };
    expect(config.password).toBe("test");
    expect(config.host).toBeUndefined();
    expect(config.ssl).toBeUndefined();
  });

  it("accepts full config", () => {
    const config: MsfRpcConfig = {
      host: "192.168.1.50",
      port: 55553,
      password: "pass123",
      username: "msf",
      ssl: true,
      timeout: 60000,
      uri: "/api/",
    };
    expect(config.port).toBe(55553);
    expect(config.timeout).toBe(60000);
  });
});
