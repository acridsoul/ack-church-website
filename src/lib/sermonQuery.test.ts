import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { fetchAllSermons, Sermon } from "./sermonLoader";
import {
  buildSermonContext,
  canonicalPreacher,
  detectIntent,
  formatSermonDate,
  isAffirmative,
  isNegative,
  isOpenEnded,
  matchPreacher,
  parseDateQuery,
  resolveByName,
  resolveQuery,
  sermonPreachers,
  sermonTitle,
} from "./sermonQuery";

/**
 * These tests run against the real archive: `fetch` is stubbed to read
 * public/content/sermons from disk, so the loader's own parsing is exercised too.
 */
const CONTENT_DIR = join(process.cwd(), "public", "content", "sermons");

const response = (body: string, ok = true) =>
  ({
    ok,
    status: ok ? 200 : 404,
    json: async () => JSON.parse(body),
    text: async () => body,
  }) as unknown as Response;

let sermons: Sermon[] = [];

beforeAll(async () => {
  vi.stubGlobal("fetch", async (input: unknown) => {
    const rel = String(input).replace(/^\/content\/sermons\//, "");
    try {
      return response(readFileSync(join(CONTENT_DIR, rel), "utf8"));
    } catch {
      return response("", false);
    }
  });
  sermons = await fetchAllSermons();
});

const byId = (id: string) => sermons.find((s) => s.id === id);

/* ------------------------------------------------------------------ */

describe("archive fixture", () => {
  it("loads every sermon, newest first", () => {
    expect(sermons.length).toBe(28);
    expect(sermons[0].id).toBe("2026-07-19");
    const dates = sermons.map((s) => s.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });
});

describe("preacher canonicalisation", () => {
  it("collapses each person's recorded variants to one name", () => {
    const groups: Array<[string, string[]]> = [
      ["Rev. Henry Kinyua", ["Vicar Henry Kinyua", "Rev Henry Kinyua", "Vicar Henry", "Rev Henry", "Vicar"]],
      ["Lay Reader Francis Kungu", ["Lay Reader Francis Kungu", "Lay Reader Kungu", "L/R Kungu", "Lay Reader Francis"]],
      ["Lay Reader Margaret", ["Lay Reader Margaret", "L/R Margaret", "Lay Reader Margret"]],
      ["Lay Reader Lydia Njoroge", ["Lay Reader Lydia Njoroge", "L/R Lydia"]],
      ["Lay Reader Consolata", ["Lay Reader Consolata", "L/R Consolata"]],
      ["Elder Peter Murigi Kuria", ["Elder Peter Murigi Kuria", "Elder Peter Murigi", "Peter Murigi"]],
      ["Eunice Njoki Karanja", ["Eunice Njoki Karanja", "Eunice"]],
    ];

    for (const [canonical, variants] of groups) {
      for (const variant of variants) {
        expect(canonicalPreacher(variant), variant).toBe(canonical);
      }
    }
  });

  it("never merges two different people who share a surname", () => {
    expect(canonicalPreacher("Esther Nyokabi")).toBe("Lay Reader Esther Nyokabi");
    // Not in the alias map, so it must pass through untouched rather than
    // collapsing onto the other Nyokabi.
    expect(canonicalPreacher("Veronica Nyokabi")).toBe("Veronica Nyokabi");
  });

  it("treats non-people in the preacher field as nobody", () => {
    expect(canonicalPreacher("")).toBeNull();
    expect(canonicalPreacher("No English Service this Sunday")).toBeNull();
  });

  it("finds a preacher from a bare surname or first name", () => {
    expect(matchPreacher("what did Kinyua say", sermons)).toBe("Rev. Henry Kinyua");
    expect(matchPreacher("sermons by Consolata", sermons)).toBe("Lay Reader Consolata");
    expect(matchPreacher("who is Margret", sermons)).toBe("Lay Reader Margaret");
    expect(matchPreacher("readings for easter", sermons)).toBeUndefined();
  });

  it("canonicalises every preacher string that appears in the archive", () => {
    const raw = new Set<string>();
    for (const sermon of sermons) {
      raw.add(sermon.englishService.preacher);
      raw.add(sermon.kikuyuService.preacher);
    }
    const canonical = new Set<string>();
    for (const value of raw) {
      const name = canonicalPreacher(value);
      if (name !== null) {
        expect(name.trim().length).toBeGreaterThan(0);
        canonical.add(name);
      }
    }
    // Normalisation must actually reduce the set, or the alias map has drifted.
    expect(canonical.size).toBeLessThan(raw.size);
  });

  it("lists the preachers attached to a sermon", () => {
    const sermon = byId("2026-07-19");
    expect(sermonPreachers(sermon!)).toEqual(["Rev. Henry Kinyua"]);
  });
});

describe("date parsing", () => {
  it("parses every supported shape to the same day", () => {
    const expected = { year: 2026, month: 6, day: 19 };
    for (const text of [
      "2026-07-19",
      "19 July 2026",
      "19th July 2026",
      "19th of July 2026",
      "July 19, 2026",
      "Jul 19 2026",
      "19/07/2026",
      "19-07-2026",
      "19.07.2026",
    ]) {
      expect(parseDateQuery(text), text).toEqual(expected);
    }
  });

  it("resolves the day and month without a year", () => {
    expect(parseDateQuery("19 July")).toEqual({ year: undefined, month: 6, day: 19 });
  });

  it("prefers ISO over the day/month pattern", () => {
    expect(parseDateQuery("service on 2026-07-19")).toEqual({ year: 2026, month: 6, day: 19 });
  });

  it("reads day-first for ambiguous numeric dates", () => {
    expect(parseDateQuery("07/08/2026")).toEqual({ year: 2026, month: 7, day: 7 });
    expect(parseDateQuery("25/08/2026")).toEqual({ year: 2026, month: 7, day: 25 });
    expect(parseDateQuery("08/25/2026")).toEqual({ year: 2026, month: 7, day: 25 });
  });

  it("does not mistake a Sunday name for a date", () => {
    expect(parseDateQuery("7th Sunday after Trinity")).toBeUndefined();
    expect(parseDateQuery("what was the theme")).toBeUndefined();
  });

  it("finds first-of-month sermons regardless of timezone", () => {
    // These dates are the ones new Date("YYYY-MM-DD") would shift backwards.
    expect(resolveQuery("2026-02-01", sermons).sermon?.id).toBe("2026-02-01");
    expect(resolveQuery("1 February", sermons).sermon?.id).toBe("2026-02-01");
    expect(resolveQuery("2026-03-01", sermons).sermon?.id).toBe("2026-03-01");
  });

  it("treats 'latest' as the newest sermon", () => {
    expect(resolveQuery("latest", sermons).sermon?.id).toBe("2026-07-19");
  });
});

describe("Sunday name matching", () => {
  it("matches across ordinal words, digits and filler", () => {
    for (const text of [
      "7th Sunday After Trinity",
      "7th sunday after trinity",
      "trinity 7",
      "seventh sunday after trinity",
      "readings for 7th Sunday after Trinity",
    ]) {
      const top = resolveByName(text, sermons)[0];
      expect(top?.sermon.sundayName, text).toBe("7th Sunday After Trinity");
    }
  });

  it("matches ordinal words against digit names and vice versa", () => {
    // The archive spells this one "Third Sunday of Easter".
    expect(resolveByName("3rd Sunday of Easter", sermons)[0]?.sermon.sundayName).toBe(
      "Third Sunday of Easter",
    );
  });

  it("prefers an exact name over a longer one containing it", () => {
    const top = resolveByName("easter", sermons)[0];
    expect(top?.sermon.sundayName).toBe("Easter Sunday");
  });

  it("matches a distinctive subtitle", () => {
    expect(resolveByName("talent sunday", sermons)[0]?.sermon.sundayName).toBe(
      "6th Sunday After Trinity - Talent Sunday (Mothers Union)",
    );
  });

  it("matches Pentecost exactly rather than by container", () => {
    expect(resolveByName("sunday after pentecost", sermons)[0]?.sermon.sundayName).toBe(
      "Sunday after Pentecost",
    );
  });

  it("never matches the sermons that have no Sunday name", () => {
    const unnamed = sermons.filter((s) => !s.sundayName.trim());
    expect(unnamed.length).toBe(5);
    for (const sermon of unnamed) {
      const hits = resolveByName(sermonTitle(sermon), sermons).map((m) => m.sermon.id);
      expect(hits).not.toContain(sermon.id);
    }
  });
});

describe("intent detection", () => {
  it("classifies the question being asked", () => {
    const cases: Array<[string, string]> = [
      ["readings for 7th Sunday after Trinity", "readings"],
      ["what were the bible verses", "readings"],
      ["who preached on 19 July", "preacher"],
      ["what was the theme on Easter Sunday", "theme"],
      ["show me the notes", "notes"],
      ["list all sermons by Consolata", "list"],
      ["what can you do", "help"],
      ["19 July 2026", "unknown"],
    ];
    for (const [text, intent] of cases) {
      expect(detectIntent(text), text).toBe(intent);
    }
  });

  it("only treats genuinely open-ended questions as needing the LLM", () => {
    expect(isOpenEnded("what did the vicar say about stewardship")).toBe(true);
    expect(isOpenEnded("why is stewardship important")).toBe(true);
    expect(isOpenEnded("explain the message")).toBe(true);
    expect(isOpenEnded("19 July 2026")).toBe(false);
    expect(isOpenEnded("readings for Easter")).toBe(false);
  });
});

describe("the core flow: Sunday -> readings, preacher, theme -> offer notes", () => {
  it("answers a readings question and offers the notes", () => {
    const result = resolveQuery("readings for 7th Sunday after Trinity", sermons);
    expect(result.intent).toBe("readings");
    expect(result.sermon?.id).toBe("2026-07-19");
    expect(result.offerNotes).toBe(true);
    expect(result.sermon?.englishService.bibleVerses).toEqual([
      "Nehemiah 2:1-10",
      "Mark 16:10-20",
    ]);
    expect(result.sermon?.kikuyuService.bibleVerses).toEqual([
      "Nehemia 2:1-10",
      "Mariko 16:10-20",
    ]);
    expect(result.sermon?.theme).toBe("Mission in the Workplace");
  });

  it("answers who preached", () => {
    const result = resolveQuery("who preached on 19 July 2026", sermons);
    expect(result.intent).toBe("preacher");
    expect(result.sermon?.id).toBe("2026-07-19");
    expect(sermonPreachers(result.sermon!)).toEqual(["Rev. Henry Kinyua"]);
  });

  it("answers a bare date with the full overview and no LLM call", () => {
    const result = resolveQuery("19 July 2026", sermons);
    expect(result.intent).toBe("sunday_overview");
    expect(result.sermon?.id).toBe("2026-07-19");
    expect(result.offerNotes).toBe(true);
    expect(result.escalate).toBe(false);
  });

  it("answers an open-ended question from the archive, without inventing a Sunday", () => {
    const result = resolveQuery("what did the vicar say about stewardship", sermons);
    expect(result.escalate).toBe(true);
    expect(result.sermon).toBeUndefined();
    expect(result.relevant!.length).toBeGreaterThan(0);
    expect(result.relevant!.some((s) => /stewardship/i.test(s.theme ?? ""))).toBe(true);
  });

  it("grounds an open-ended question about a named Sunday in that Sunday", () => {
    const result = resolveQuery("what did they teach about mission on 19 July 2026", sermons);
    expect(result.sermon?.id).toBe("2026-07-19");
    expect(result.escalate).toBe(true);
    expect(result.relevant?.[0]?.id).toBe("2026-07-19");
  });

  it("honours an explicit service", () => {
    expect(resolveQuery("kikuyu readings for Easter Sunday", sermons).service).toBe("kikuyu");
    expect(resolveQuery("english readings for Easter Sunday", sermons).service).toBe("english");
  });

  it("ignores the service word when matching a Sunday name", () => {
    // "kikuyu ... Easter" must not be read as a Sunday called "kikuyu easter".
    const result = resolveQuery("kikuyu readings for Easter Sunday", sermons);
    expect(result.sermon?.sundayName).toBe("Easter Sunday");
    expect(result.sermon?.kikuyuService.bibleVerses.length).toBeGreaterThan(0);
  });

  it("delivers notes once the visitor agrees", () => {
    const first = resolveQuery("readings for 7th Sunday after Trinity", sermons);
    const pending = { pendingSermon: first.sermon };
    expect(resolveQuery("yes please", sermons, pending).intent).toBe("notes");
    expect(resolveQuery("yes, show me the notes", sermons, pending).intent).toBe("notes");
    expect(resolveQuery("ndio", sermons, pending).intent).toBe("notes");
    expect(resolveQuery("no thanks", sermons, pending).intent).toBe("decline");
    expect(resolveQuery("hapana", sermons, pending).intent).toBe("decline");
  });

  it("carries the pending sermon when no new target is named", () => {
    const pending = { pendingSermon: byId("2026-07-19") };
    const result = resolveQuery("what about the readings", sermons, pending);
    expect(result.intent).toBe("readings");
    expect(result.sermon?.id).toBe("2026-07-19");
  });

  it("lets a new target override the pending sermon", () => {
    const pending = { pendingSermon: byId("2026-07-19") };
    const result = resolveQuery("readings for Easter Sunday", sermons, pending);
    expect(result.sermon?.id).not.toBe("2026-07-19");
    expect(result.sermon?.sundayName).toBe("Easter Sunday");
  });
});

describe("ambiguity, lists and dead ends", () => {
  it("asks which Sunday when several match equally", () => {
    const result = resolveQuery("lent", sermons);
    expect(result.intent).toBe("sunday_overview");
    expect(result.sermon).toBeUndefined();
    expect(result.candidates!.length).toBeGreaterThan(1);
    expect(result.candidates!.every((s) => /lent/i.test(s.sundayName))).toBe(true);
  });

  it("prefers an exact name over the ambiguous group it belongs to", () => {
    // "trinity" exactly names `Trinity Sunday`, so it is not ambiguous.
    const result = resolveQuery("trinity", sermons);
    expect(result.sermon?.sundayName).toBe("Trinity Sunday");
    expect(result.candidates).toBeUndefined();
  });

  it("resolves a disambiguation by number or date", () => {
    const first = resolveQuery("lent", sermons);
    const candidates = first.candidates!;
    expect(resolveQuery("2", sermons, { candidates }).sermon?.id).toBe(candidates[1].id);
    expect(resolveQuery("the first one", sermons, { candidates }).sermon?.id).toBe(candidates[0].id);
    const dated = resolveQuery("1st Sunday of Lent", sermons, { candidates });
    expect(dated.sermon?.sundayName).toBe("1st Sunday of Lent");
  });

  it("reads a preacher with several sermons as a list, not a single Sunday", () => {
    const result = resolveQuery("show me sermons by Lay Reader Consolata", sermons);
    expect(result.intent).toBe("list");
    expect(result.preacher).toBe("Lay Reader Consolata");
    expect(result.list!.length).toBeGreaterThan(1);
    for (const sermon of result.list!) {
      expect(sermonPreachers(sermon)).toContain("Lay Reader Consolata");
    }
  });

  it("asks which Sunday when a structured question names none", () => {
    const result = resolveQuery("what were the readings", sermons);
    expect(result.intent).toBe("unknown");
    expect(result.needsTarget).toBe(true);
    expect(result.escalate).toBeFalsy();
  });

  it("does not invent a Sunday for gibberish", () => {
    const result = resolveQuery("asdfghjkl", sermons);
    expect(result.intent).toBe("unknown");
    expect(result.sermon).toBeUndefined();
    expect(result.candidates).toBeUndefined();
  });

  it("answers help without needing a target", () => {
    expect(resolveQuery("what can you do", sermons).intent).toBe("help");
  });
});

describe("affirmative and negative recognition", () => {
  it("recognises agreement, including Swahili and Gikuyu", () => {
    for (const text of ["yes", "yes please", "sure", "ok", "show me", "ndio", "sawa", "\u0129\u0129"]) {
      expect(isAffirmative(text), text).toBe(true);
    }
  });

  it("recognises refusal", () => {
    for (const text of ["no", "no thanks", "not now", "hapana", "aca", "later"]) {
      expect(isNegative(text), text).toBe(true);
    }
  });

  it("does not mistake a new question for agreement", () => {
    // "show" must not swallow a genuine request for a different Sunday.
    expect(isAffirmative("show me the readings for Easter")).toBe(false);
    expect(isAffirmative("notes for November")).toBe(false);
    expect(isNegative("notes for November")).toBe(false);
    expect(isNegative("no idea what the theme was")).toBe(false);
  });
});

describe("LLM context and presentation", () => {
  it("builds grounded context from a sermon", () => {
    const context = buildSermonContext(byId("2026-07-19")!);
    expect(context).toContain("Date: 2026-07-19");
    expect(context).toContain("7th Sunday After Trinity");
    expect(context).toContain("Mission in the Workplace");
    expect(context).toContain("Nehemiah 2:1-10");
    expect(context).toContain("English Service notes:");
    expect(context).toContain("Kikuyu Service notes:");
  });

  it("flags missing data rather than leaving blanks", () => {
    const context = buildSermonContext(byId("2026-06-28")!);
    expect(context).toContain("Sunday: 4th Sunday After Trinity");
    expect(context).toContain("preacher: not recorded");
  });

  it("falls back to the date when a sermon has no Sunday name", () => {
    expect(sermonTitle(byId("2026-01-11")!)).toBe("Sunday, 11 January 2026");
    expect(sermonTitle(byId("2026-07-19")!)).toBe("7th Sunday After Trinity");
  });

  it("formats dates timezone-safely", () => {
    expect(formatSermonDate("2026-02-01")).toBe("Sunday, 1 February 2026");
  });
});
