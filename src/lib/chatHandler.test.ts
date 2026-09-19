/**
 * Harness for the serverless handler in api/chat.ts.
 *
 * This lives under src/ on purpose: Vercel deploys every file in a root `api/`
 * directory as a function, and a co-located .test.ts would become an endpoint.
 */
import { Readable } from "node:stream";
import type { IncomingMessage, ServerResponse } from "node:http";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler from "../../api/chat";

interface Captured {
  status?: number;
  headers?: Record<string, string>;
  body?: string;
}

const makeReq = (
  method: string,
  body?: unknown,
  headers: Record<string, string> = {},
): IncomingMessage => {
  const req = Readable.from(
    body === undefined ? [] : [Buffer.from(JSON.stringify(body))],
  ) as unknown as IncomingMessage & { method: string; headers: Record<string, string> };
  req.method = method;
  req.headers = { "x-forwarded-for": `10.0.0.${Math.floor(Math.random() * 250) + 1}`, ...headers };
  return req;
};

const makeRes = () => {
  const captured: Captured = {};
  const res = {
    writeHead(status: number, headers: Record<string, string>) {
      captured.status = status;
      captured.headers = headers;
      return res;
    },
    end(chunk?: string) {
      if (chunk) captured.body = chunk;
    },
  } as unknown as ServerResponse;
  return { res, captured };
};

const invoke = async (method: string, body?: unknown, headers?: Record<string, string>) => {
  const req = makeReq(method, body, headers);
  const { res, captured } = makeRes();
  await handler(req, res);
  return {
    status: captured.status,
    headers: captured.headers ?? {},
    json: captured.body ? JSON.parse(captured.body) : undefined,
  };
};

const validBody = {
  question: "What did the notes say about stewardship?",
  context: ["Date: 2026-06-07\nTheme: Stewardship\nEnglish Service notes:\n1. God has called us to be stewards"],
};

interface ProviderCall {
  url: string;
  body: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    max_tokens: number;
    temperature: number;
  };
}

let providerCalls: ProviderCall[] = [];

beforeEach(() => {
  providerCalls = [];
  process.env.LLM_API_KEY = "test-key";
  process.env.LLM_BASE_URL = "https://provider.test/v1";
  process.env.LLM_MODEL = "test-model";
  delete process.env.ALLOWED_ORIGINS;

  vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
    providerCalls.push({ url: String(url), body: JSON.parse(String(init.body)) });
    return {
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: "Grounded answer." } }] }),
    } as unknown as Response;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("api/chat guards", () => {
  it("rejects non-POST methods", async () => {
    const result = await invoke("GET");
    expect(result.status).toBe(405);
  });

  it("answers CORS preflight", async () => {
    const result = await invoke("OPTIONS");
    expect(result.status).toBe(204);
  });

  it("is unavailable when no key is configured", async () => {
    delete process.env.LLM_API_KEY;
    const result = await invoke("POST", validBody);
    expect(result.status).toBe(503);
    expect(providerCalls).toHaveLength(0);
  });

  it("requires a question", async () => {
    expect((await invoke("POST", { context: [] })).status).toBe(400);
    expect((await invoke("POST", { question: "   " })).status).toBe(400);
  });

  it("rejects an over-long question", async () => {
    const result = await invoke("POST", { question: "x".repeat(501), context: [] });
    expect(result.status).toBe(413);
    expect(providerCalls).toHaveLength(0);
  });

  it("rejects a malformed body", async () => {
    const req = Readable.from([Buffer.from("not json")]) as unknown as IncomingMessage & {
      method: string;
      headers: Record<string, string>;
    };
    req.method = "POST";
    req.headers = { "x-forwarded-for": "10.9.9.9" };
    const { res, captured } = makeRes();
    await handler(req, res);
    expect(captured.status).toBe(400);
  });

  it("rate limits a client that keeps asking", async () => {
    const headers = { "x-forwarded-for": "203.0.113.7" };
    const statuses: number[] = [];
    for (let i = 0; i < 14; i += 1) {
      statuses.push((await invoke("POST", validBody, headers)).status);
    }
    expect(statuses.filter((status) => status === 200).length).toBeGreaterThan(0);
    expect(statuses.at(-1)).toBe(429);
  });

  it("refuses an origin that is not on the allow-list", async () => {
    process.env.ALLOWED_ORIGINS = "https://allowed.example";
    vi.resetModules();
    const { default: freshHandler } = await import("../../api/chat");
    const req = makeReq("POST", validBody, { origin: "https://evil.example" });
    const { res, captured } = makeRes();
    await freshHandler(req, res);
    expect(captured.status).toBe(403);
  });

  it("echoes CORS headers for an allowed origin", async () => {
    process.env.ALLOWED_ORIGINS = "https://allowed.example";
    vi.resetModules();
    const { default: freshHandler } = await import("../../api/chat");
    const req = makeReq("POST", validBody, { origin: "https://allowed.example" });
    const { res, captured } = makeRes();
    await freshHandler(req, res);
    expect(captured.status).toBe(200);
    expect(captured.headers?.["Access-Control-Allow-Origin"]).toBe("https://allowed.example");
  });
});

describe("api/chat behaviour", () => {
  it("answers from the supplied context", async () => {
    const result = await invoke("POST", validBody);
    expect(result.status).toBe(200);
    expect(result.json.answer).toBe("Grounded answer.");
    expect(result.headers["Cache-Control"]).toBe("no-store");
  });

  it("sends the context and the grounding rules to the provider", async () => {
    await invoke("POST", validBody);
    expect(providerCalls).toHaveLength(1);

    const [call] = providerCalls;
    expect(call.url).toBe("https://provider.test/v1/chat/completions");
    expect(call.body.model).toBe("test-model");
    expect(call.body.temperature).toBeLessThanOrEqual(0.3);
    expect(call.body.max_tokens).toBeGreaterThan(0);

    const system = call.body.messages[0];
    expect(system.role).toBe("system");
    // The two rules that keep a church site honest.
    expect(system.content).toMatch(/never invent bible verse text/i);
    expect(system.content).toMatch(/never invent a preacher/i);

    const user = call.body.messages[1];
    expect(user.content).toContain("stewardship");
    expect(user.content).toContain(validBody.question);
  });

  it("never forwards an API key to the client", async () => {
    const result = await invoke("POST", validBody);
    expect(JSON.stringify(result.json)).not.toContain("test-key");
  });

  it("caps how much context it forwards", async () => {
    const context = Array.from({ length: 10 }, (_, i) => `Extract ${i} ${"y".repeat(3000)}`);
    await invoke("POST", { question: "help", context });
    const [call] = providerCalls;
    expect(call.body.messages[1].content.length).toBeLessThan(20000);
    expect(call.body.messages[1].content).toContain("Extract 0");
  });

  it("tells the model when there is no context", async () => {
    await invoke("POST", { question: "anything", context: [] });
    expect(providerCalls[0].body.messages[1].content).toContain("no extracts");
  });

  it("reports a provider failure as 502", async () => {
    vi.stubGlobal("fetch", async () => ({ ok: false, status: 500 }) as unknown as Response);
    const result = await invoke("POST", validBody);
    expect(result.status).toBe(502);
  });

  it("treats an empty provider answer as a failure", async () => {
    vi.stubGlobal(
      "fetch",
      async () =>
        ({ ok: true, status: 200, json: async () => ({ choices: [] }) }) as unknown as Response,
    );
    const result = await invoke("POST", validBody);
    expect(result.status).toBe(502);
  });
});
