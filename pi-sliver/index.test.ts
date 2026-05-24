import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  short,
  normalize,
  toBuffer,
  decodeBytes,
  nsString,
  includeFlagsFor,
} from "./index";

// ---------------------------------------------------------------------------
// short() — ID truncation
// ---------------------------------------------------------------------------
describe("short", () => {
  it("truncates a UUID to 8 chars", () => {
    expect(short("7acfe805-fc77-4c22-9c2c-ef535f238627")).toBe("7acfe805");
  });

  it("returns short strings as-is", () => {
    expect(short("abc")).toBe("abc");
  });

  it("returns ? for null/undefined", () => {
    expect(short(null)).toBe("?");
    expect(short(undefined)).toBe("?");
  });

  it("converts non-string to string", () => {
    expect(short(42)).toBe("42");
  });
});

// ---------------------------------------------------------------------------
// normalize() — recursive Uint8Array → base64
// ---------------------------------------------------------------------------
describe("normalize", () => {
  it("converts Uint8Array to base64", () => {
    const bytes = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
    const result = normalize(bytes);
    expect(result).toBe("SGVsbG8=");
  });

  it("recurses through arrays", () => {
    const result = normalize([new Uint8Array([65]), "text"]);
    expect(result).toEqual(["QQ==", "text"]);
  });

  it("recurses through objects", () => {
    const result = normalize({ data: new Uint8Array([66]), nested: { val: 42 } });
    expect(result).toEqual({ data: "Qg==", nested: { val: 42 } });
  });

  it("returns null/undefined unchanged", () => {
    expect(normalize(null)).toBeNull();
    expect(normalize(undefined)).toBeUndefined();
  });

  it("passes primitives through", () => {
    expect(normalize("hello")).toBe("hello");
    expect(normalize(123)).toBe(123);
    expect(normalize(true)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// toBuffer() — type coercion to Buffer
// ---------------------------------------------------------------------------
describe("toBuffer", () => {
  it("converts Uint8Array to Buffer", () => {
    const buf = toBuffer(new Uint8Array([1, 2, 3]));
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf).toEqual(Buffer.from([1, 2, 3]));
  });

  it("decodes base64 string", () => {
    const buf = toBuffer("SGVsbG8=");
    expect(buf.toString("utf8")).toBe("Hello");
  });

  it("returns empty buffer for falsy values", () => {
    expect(toBuffer(null)).toEqual(Buffer.alloc(0));
    expect(toBuffer(undefined)).toEqual(Buffer.alloc(0));
    expect(toBuffer("")).toEqual(Buffer.alloc(0));
  });

  it("passes through existing Buffer", () => {
    const orig = Buffer.from("test");
    expect(toBuffer(orig)).toBe(orig);
  });
});

// ---------------------------------------------------------------------------
// decodeBytes() — byte → UTF-8 string
// ---------------------------------------------------------------------------
describe("decodeBytes", () => {
  it("decodes Uint8Array to UTF-8", () => {
    expect(decodeBytes(new Uint8Array([72, 101, 108, 108, 111]))).toBe("Hello");
  });

  it("decodes base64 string", () => {
    expect(decodeBytes("SGVsbG8=")).toBe("Hello");
  });

  it("returns empty string for null/undefined", () => {
    expect(decodeBytes(null)).toBe("");
    expect(decodeBytes(undefined)).toBe("");
  });
});

// ---------------------------------------------------------------------------
// nsString() — seconds → nanoseconds decimal string
// ---------------------------------------------------------------------------
describe("nsString", () => {
  it("converts 60 seconds to nanoseconds", () => {
    expect(nsString(60)).toBe("60000000000");
  });

  it("converts 0 to 0", () => {
    expect(nsString(0)).toBe("0");
  });

  it("floors fractional seconds", () => {
    expect(nsString(1.5)).toBe("1000000000");
  });

  it("clamps negative values to 0", () => {
    expect(nsString(-10)).toBe("0");
  });
});

// ---------------------------------------------------------------------------
// includeFlagsFor() — C2 URL scheme → Include* flags
// ---------------------------------------------------------------------------
describe("includeFlagsFor", () => {
  it("sets IncludeMTLS for mtls://", () => {
    const flags = includeFlagsFor("mtls://10.10.14.175:443");
    expect(flags.IncludeMTLS).toBe(true);
    expect(flags.IncludeHTTP).toBe(false);
    expect(flags.IncludeDNS).toBe(false);
  });

  it("sets IncludeHTTP for http://", () => {
    const flags = includeFlagsFor("http://10.10.14.175:80/c2");
    expect(flags.IncludeHTTP).toBe(true);
    expect(flags.IncludeMTLS).toBe(false);
  });

  it("sets IncludeHTTP for https://", () => {
    const flags = includeFlagsFor("https://10.10.14.175:443");
    expect(flags.IncludeHTTP).toBe(true);
  });

  it("sets IncludeDNS for dns://", () => {
    const flags = includeFlagsFor("dns://example.com");
    expect(flags.IncludeDNS).toBe(true);
  });

  it("sets IncludeWG for wg://", () => {
    const flags = includeFlagsFor("wg://10.10.14.175:53");
    expect(flags.IncludeWG).toBe(true);
  });

  it("sets IncludeNamePipe for namedpipe://", () => {
    const flags = includeFlagsFor("namedpipe://./pipe/sliver");
    expect(flags.IncludeNamePipe).toBe(true);
  });

  it("sets IncludeTCP for tcppivot://", () => {
    const flags = includeFlagsFor("tcppivot://10.10.14.175:8080");
    expect(flags.IncludeTCP).toBe(true);
  });

  it("returns all false for unknown scheme", () => {
    const flags = includeFlagsFor("grpc://10.10.14.175:9000");
    expect(Object.values(flags).every((v) => v === false)).toBe(true);
  });

  it("returns all false for empty string", () => {
    const flags = includeFlagsFor("");
    expect(Object.values(flags).every((v) => v === false)).toBe(true);
  });
});
