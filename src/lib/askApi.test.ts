import { afterEach, describe, expect, it, vi } from "vitest";
import { askAi } from "./askApi";
import type { Sermon } from "./sermonLoader";

/**
 * The LLM layer is optional. Every failure mode below must resolve to `null` so
 * the deterministic answer stays the whole answer — never an error in front of a
 * visitor, and never a broken chat.
 */

const sermon: Sermon = {
  id: "2026-07-19",
  date: "2026-07-19",
  sundayName: "7th Sunday After Trinity",
  theme: "Mission in the Workplace",
  englishService: {
    preacher: "Vicar Henry Kinyua",
    bibleVerses: ["Nehemiah 2:1-10"],
    notes: "1. God is calling us to move towards the mission work",
  },
  kikuyuService: {
    preacher: "Vicar Henry Kinyua",
    bibleVerses: ["Nehemia 2:1-10"],
    notes: "1. Ngai nĩaratwĩta twerekere wĩra wa ũmisheni",
  },
};

const jsonResponse = (body: unknown, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => "application/json; charset=utf-8" },
    json: async () => body,
  }) as unknown as Response;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("askAi", () => {
  it("returns the answer on success", async () => {
    vi.stubGlobal("fetch", async () => jsonResponse({ answer: "  Grounded answer.  " }));
    await expect(askAi("what about stewardship", [sermon])).resolves.toBe("Grounded answer.");
  });

  it("sends the question and the sermon extracts", async () => {
    let sent: { url: string; body: { question: string; context: string[] } } | undefined;
    vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
      sent = { url: String(url), body: JSON.parse(String(init.body)) };
      return jsonResponse({ answer: "ok" });
    });

    await askAi("what was the theme", [sermon]);

    expect(sent?.url).toBe("/api/chat");
    expect(sent?.body.question).toBe("what was the theme");
    expect(sent?.body.context).toHaveLength(1);
    expect(sent?.body.context[0]).toContain("7th Sunday After Trinity");
    expect(sent?.body.context[0]).toContain("Mission in the Workplace");
  });

  it("returns null when the function is not deployed (404)", async () => {
    vi.stubGlobal("fetch", async () => jsonResponse({ error: "nope" }, 404));
    await expect(askAi("hello", [sermon])).resolves.toBeNull();
  });

  it("returns null when the assistant is unconfigured (503)", async () => {
    vi.stubGlobal("fetch", async () => jsonResponse({ error: "not configured" }, 503));
    await expect(askAi("hello", [sermon])).resolves.toBeNull();
  });

  it("returns null when rate limited (429)", async () => {
    vi.stubGlobal("fetch", async () => jsonResponse({ error: "slow down" }, 429));
    await expect(askAi("hello", [sermon])).resolves.toBeNull();
  });

  it("returns null when Vite answers with the app shell instead of JSON", async () => {
    vi.stubGlobal(
      "fetch",
      async () =>
        ({
          ok: true,
          status: 200,
          headers: { get: () => "text/html" },
          json: async () => {
            throw new Error("not json");
          },
        }) as unknown as Response,
    );
    await expect(askAi("hello", [sermon])).resolves.toBeNull();
  });

  it("returns null when the answer is empty or the wrong shape", async () => {
    vi.stubGlobal("fetch", async () => jsonResponse({ answer: "   " }));
    await expect(askAi("hello", [sermon])).resolves.toBeNull();

    vi.stubGlobal("fetch", async () => jsonResponse({ unexpected: true }));
    await expect(askAi("hello", [sermon])).resolves.toBeNull();
  });

  it("returns null when the network fails", async () => {
    vi.stubGlobal("fetch", async () => {
      throw new TypeError("Failed to fetch");
    });
    await expect(askAi("hello", [sermon])).resolves.toBeNull();
  });

  it("returns null when the request is aborted", async () => {
    vi.stubGlobal("fetch", async () => {
      throw new DOMException("Aborted", "AbortError");
    });
    await expect(askAi("hello", [sermon])).resolves.toBeNull();
  });
});
