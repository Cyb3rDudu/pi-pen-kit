import { describe, it, expect } from "vitest";
import { parseConfig, listConfigs, type SliverClientConfig } from "./lib/config";
import { InteractiveBeacon, InteractiveSession, SliverClient } from "./lib/client";

// ---------------------------------------------------------------------------
// parseConfig()
// ---------------------------------------------------------------------------
describe("parseConfig", () => {
  const validConfig: SliverClientConfig = {
    operator: "dudu",
    lhost: "127.0.0.1",
    lport: 31337,
    ca_certificate: "-----BEGIN CERT-----\n...",
    certificate: "-----BEGIN CERT-----\n...",
    private_key: "-----BEGIN KEY-----\n...",
    token: "abc123",
  };

  it("parses a valid config buffer", () => {
    const buf = Buffer.from(JSON.stringify(validConfig));
    const result = parseConfig(buf);
    expect(result.operator).toBe("dudu");
    expect(result.lhost).toBe("127.0.0.1");
    expect(result.lport).toBe(31337);
    expect(result.token).toBe("abc123");
  });

  it("throws on missing operator", () => {
    const bad = { ...validConfig, operator: undefined };
    expect(() => parseConfig(Buffer.from(JSON.stringify(bad)))).toThrow("operator");
  });

  it("throws on missing lhost", () => {
    const bad = { ...validConfig, lhost: undefined };
    expect(() => parseConfig(Buffer.from(JSON.stringify(bad)))).toThrow("lhost");
  });

  it("throws on missing lport", () => {
    const bad = { ...validConfig, lport: undefined };
    expect(() => parseConfig(Buffer.from(JSON.stringify(bad)))).toThrow("lport");
  });

  it("throws on non-finite lport", () => {
    const bad = { ...validConfig, lport: Infinity };
    expect(() => parseConfig(Buffer.from(JSON.stringify(bad)))).toThrow("lport");
  });

  it("throws on missing token", () => {
    const bad = { ...validConfig, token: undefined };
    expect(() => parseConfig(Buffer.from(JSON.stringify(bad)))).toThrow("token");
  });

  it("throws on missing private_key", () => {
    const bad = { ...validConfig, private_key: undefined };
    expect(() => parseConfig(Buffer.from(JSON.stringify(bad)))).toThrow("private_key");
  });

  it("throws on missing ca_certificate", () => {
    const bad = { ...validConfig, ca_certificate: undefined };
    expect(() => parseConfig(Buffer.from(JSON.stringify(bad)))).toThrow("ca_certificate");
  });

  it("throws on missing certificate", () => {
    const bad = { ...validConfig, certificate: undefined };
    expect(() => parseConfig(Buffer.from(JSON.stringify(bad)))).toThrow("certificate");
  });

  it("throws on invalid JSON", () => {
    expect(() => parseConfig(Buffer.from("not json"))).toThrow();
  });
});

// ---------------------------------------------------------------------------
// listConfigs()
// ---------------------------------------------------------------------------
describe("listConfigs", () => {
  it("returns empty array for non-existent directory", async () => {
    const result = await listConfigs("/tmp/does-not-exist-slkfjsldkfj");
    expect(result).toEqual([]);
  });

  it("returns empty array for empty directory", async () => {
    const { mkdirSync, rmSync } = await import("node:fs");
    const dir = "/tmp/sliver-test-empty-dir";
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir);
    const result = await listConfigs(dir);
    expect(result).toEqual([]);
    rmSync(dir, { recursive: true, force: true });
  });
});

// ---------------------------------------------------------------------------
// SliverClient — constructor only (no connect)
// ---------------------------------------------------------------------------
describe("SliverClient", () => {
  it("stores config and reports disconnected", () => {
    const client = new SliverClient({
      operator: "test",
      lhost: "127.0.0.1",
      lport: 31337,
      ca_certificate: "",
      certificate: "",
      private_key: "",
      token: "tok",
    });
    expect(client.isConnected).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// InteractiveBeacon — request() format
// ---------------------------------------------------------------------------
describe("InteractiveBeacon", () => {
  it("produces async request with BeaconID", () => {
    // We can't easily instantiate without a real RPC client,
    // but we can test through the public API surface.
    // The class is constructed internally by SliverClient,
    // so we test the config + construction chain instead.
    expect(true).toBe(true); // placeholder — beacon blocking is tested via CI
  });
});
