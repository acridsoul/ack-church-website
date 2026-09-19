import { getSermonDateParts, toSermonDate, Sermon } from "./sermonLoader";

/**
 * Query layer for the /ask chatbot.
 *
 * Everything here is pure: hand it the loaded sermons and a visitor's text, and it
 * returns what to say. The LLM (api/chat.ts) is only consulted for questions this
 * layer cannot place — see `QueryResult.escalate`.
 */

export type ServiceKey = "english" | "kikuyu";

export type QueryIntent =
  | "sunday_overview"
  | "readings"
  | "preacher"
  | "theme"
  | "notes"
  | "list"
  | "help"
  | "decline"
  | "unknown";

export interface QueryContext {
  /** Sermon the assistant has just offered the notes for. */
  pendingSermon?: Sermon;
  /** Sermons awaiting a disambiguation choice. */
  candidates?: Sermon[];
}

export interface QueryResult {
  intent: QueryIntent;
  /** A single resolved Sunday. */
  sermon?: Sermon;
  /** Several plausible Sundays — ask the visitor which one. */
  candidates?: Sermon[];
  /** Several sermons in answer to a "list"/preacher question. */
  list?: Sermon[];
  service?: ServiceKey;
  /** Canonical preacher the question was about. */
  preacher?: string;
  /** Show the "would you like the notes?" affordance. */
  offerNotes?: boolean;
  /** A structured question with no Sunday attached — ask which Sunday. */
  needsTarget?: boolean;
  /** Hand this question to the LLM as well. */
  escalate?: boolean;
  /** Sermons retrieved as grounding when escalating to the LLM. */
  relevant?: Sermon[];
}

/* ------------------------------------------------------------------ */
/* Preacher names                                                      */
/* ------------------------------------------------------------------ */

/**
 * The archive records the same people many different ways — `L/R Kungu`,
 * `Lay Reader Kungu` and `Lay Reader Francis Kungu` are one person, and
 * `Lay Reader Margret` is a typo for Margaret.
 *
 * This map is deliberately explicit and hand-written. Do NOT match on surnames:
 * `Veronica Nyokabi` and `Esther Nyokabi` are different people.
 */
const PREACHER_ALIASES: Record<string, string> = {
  // Vicar In Charge — recorded five ways
  "vicar henry kinyua": "Rev. Henry Kinyua",
  "rev henry kinyua": "Rev. Henry Kinyua",
  "vicar henry": "Rev. Henry Kinyua",
  "rev henry": "Rev. Henry Kinyua",
  vicar: "Rev. Henry Kinyua",

  // Lay readers
  "lay reader consolata": "Lay Reader Consolata",
  "l/r consolata": "Lay Reader Consolata",
  "lay reader francis kungu": "Lay Reader Francis Kungu",
  "lay reader kungu": "Lay Reader Francis Kungu",
  "l/r kungu": "Lay Reader Francis Kungu",
  "lay reader francis": "Lay Reader Francis Kungu",
  "lay reader margaret": "Lay Reader Margaret",
  "l/r margaret": "Lay Reader Margaret",
  "lay reader margret": "Lay Reader Margaret",
  "lay reader lydia njoroge": "Lay Reader Lydia Njoroge",
  "lay reader lydia": "Lay Reader Lydia Njoroge",
  "l/r lydia": "Lay Reader Lydia Njoroge",
  "lay reader damaris": "Lay Reader Damaris",
  "lay reader esther nyokabi": "Lay Reader Esther Nyokabi",
  "esther nyokabi": "Lay Reader Esther Nyokabi",

  // Elders and others with abbreviated records
  "elder peter murigi kuria": "Elder Peter Murigi Kuria",
  "elder peter murigi": "Elder Peter Murigi Kuria",
  "peter murigi": "Elder Peter Murigi Kuria",
  "eunice njoki karanja": "Eunice Njoki Karanja",
  eunice: "Eunice Njoki Karanja",
};

/** Values that occupy the preacher field but are not people. */
const NOT_A_PREACHER = new Set([
  "",
  "no english service this sunday",
  "none",
  "n/a",
]);

/**
 * Lowercase, strip periods and typographic apostrophes, collapse whitespace.
 * Periods are stripped so `Rev.` and `Rev` agree; note that `/` survives, which is
 * why `L/R` normalises to `l/r`.
 */
export const norm = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[.\u2018\u2019']/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Lowercase and collapse whitespace, but keep separators. Date parsing needs this:
 * `norm` strips periods, which would turn "19.07.2026" into "19072026".
 */
const lower = (value: string): string => value.toLowerCase().replace(/\s+/g, " ").trim();

/** Canonical display name for a preacher string, or null when it is not a person. */export const canonicalPreacher = (raw: string): string | null => {
  const key = norm(raw ?? "");
  if (NOT_A_PREACHER.has(key)) return null;
  return PREACHER_ALIASES[key] ?? ((raw ?? "").trim() || null);
};

/** Canonical preacher names attached to a sermon, de-duplicated. */
export const sermonPreachers = (sermon: Sermon): string[] => {
  const names = [
    canonicalPreacher(sermon.englishService?.preacher),
    canonicalPreacher(sermon.kikuyuService?.preacher),
  ].filter(Boolean) as string[];
  return [...new Set(names)];
};

const ROLE_WORDS = new Set([
  "lay", "reader", "lr", "l", "r", "elder", "rev", "vicar", "chaplain",
  "tr", "teacher", "mr", "mrs", "ms", "dr", "sr", "pastor",
]);

/** The identifying words of a person's name, with role prefixes removed. */
const personTokens = (name: string): string[] =>
  norm(name)
    .split(/[^a-z0-9\u0129\u0169]+/)
    .filter((token) => token.length > 1 && !ROLE_WORDS.has(token));

/**
 * Accepted spellings for each canonical name — the canonical form plus every
 * alias the archive uses. This is what lets a visitor type the archive's own
 * "Margret" or "L/R" spelling (both of which appear in sermons) and still match.
 */
const PREACHER_VARIANTS: Record<string, Set<string>> = (() => {
  const map: Record<string, Set<string>> = {};
  const add = (canonical: string, value: string) => {
    const set = (map[canonical] ??= new Set<string>());
    for (const token of personTokens(value)) set.add(token);
  };
  for (const [alias, canonical] of Object.entries(PREACHER_ALIASES)) {
    add(canonical, canonical);
    add(canonical, alias);
  }
  return map;
})();

/**
 * Find the preacher a question is about, by any distinctive name token.
 * Returns the canonical name, or undefined.
 */
export const matchPreacher = (text: string, sermons: Sermon[]): string | undefined => {
  const asked = new Set(personTokens(text).filter((token) => token.length >= 3));
  if (!asked.size) return undefined;

  const names = new Set<string>();
  for (const sermon of sermons) {
    for (const name of sermonPreachers(sermon)) names.add(name);
  }

  let best: string | undefined;
  let bestScore = 0;
  for (const name of names) {
    const tokens = [...(PREACHER_VARIANTS[name] ?? new Set(personTokens(name)))];
    const hits = tokens.filter((token) => asked.has(token)).length;
    if (hits > bestScore) {
      bestScore = hits;
      best = name;
    }
  }
  return best;
};

/* ------------------------------------------------------------------ */
/* Dates                                                               */
/* ------------------------------------------------------------------ */

const MONTHS: Record<string, number> = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
  may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, sept: 8,
  september: 8, oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11,
};

/** Ordinal words are interchangeable with their digits: "Third Sunday of Easter". */
const NUMBER_WORDS: Record<string, string> = {
  first: "1", second: "2", third: "3", fourth: "4", fifth: "5",
  sixth: "6", seventh: "7", eighth: "8", ninth: "9", tenth: "10",
  one: "1", two: "2", three: "3", four: "4", five: "5",
};

interface DateQuery {
  year?: number;
  month?: number;
  day?: number;
  relative?: "latest";
}

/** Parse a date out of free text. Never uses `new Date(string)` — see sermonLoader. */
export const parseDateQuery = (text: string): DateQuery | undefined => {
  const t = lower(text);

  if (/\b(latest|most recent|last sunday|this sunday|most recent sunday)\b/.test(t)) {
    return { relative: "latest" };
  }

  // ISO first, so 2026-07-19 is never mis-read by the day/month pattern below.
  let m = t.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (m) return { year: +m[1], month: +m[2] - 1, day: +m[3] };

  // 19/07/2026, 19-07, 19.07.2026 — day first unless that is impossible.
  m = t.match(/\b(\d{1,2})[/\-.](\d{1,2})(?:[/\-.](\d{2,4}))?\b/);
  if (m) {
    const a = +m[1];
    const b = +m[2];
    let year = m[3] ? +m[3] : undefined;
    if (year !== undefined && year < 100) year += 2000;
    let day: number;
    let month: number;
    if (a > 12 && b <= 12) {
      day = a;
      month = b - 1;
    } else if (b > 12 && a <= 12) {
      day = b;
      month = a - 1;
    } else {
      day = a;
      month = b - 1; // en-GB default
    }
    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      return { year, month, day };
    }
  }

  // 19 July / 19th of July 2026
  m = t.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?([a-z]+)\.?\s*(\d{4})?\b/);
  if (m && MONTHS[m[2]] !== undefined) {
    return { year: m[3] ? +m[3] : undefined, month: MONTHS[m[2]], day: +m[1] };
  }

  // July 19 / Jul 19, 2026
  m = t.match(/\b([a-z]+)\.?\s+(\d{1,2})(?:st|nd|rd|th)?\s*,?\s*(\d{4})?\b/);
  if (m && MONTHS[m[1]] !== undefined) {
    return { year: m[3] ? +m[3] : undefined, month: MONTHS[m[1]], day: +m[2] };
  }

  return undefined;
};

/** Sermons whose calendar date matches the date mentioned in the text. */
export const resolveByDate = (text: string, sermons: Sermon[]): Sermon[] => {
  const parsed = parseDateQuery(text);
  if (!parsed) return [];
  if (parsed.relative === "latest") return sermons.length ? [sermons[0]] : [];
  return sermons.filter((sermon) => {
    const parts = getSermonDateParts(sermon.date);
    if (parts.month !== parsed.month || parts.day !== parsed.day) return false;
    if (parsed.year !== undefined && parts.year !== parsed.year) return false;
    return true;
  });
};

/* ------------------------------------------------------------------ */
/* Sunday names                                                        */
/* ------------------------------------------------------------------ */

const FILLER = new Set([
  "sunday", "sundays", "after", "before", "of", "the", "in", "on", "a", "an",
  "and", "service", "services", "sermon", "sermons", "note", "notes", "for",
  "was", "were", "what", "which", "when", "who", "is", "are", "did", "do",
  "does", "week", "about", "tell", "me", "give", "show", "readings", "reading",
  "theme", "preacher", "preached", "verses", "verse", "scripture", "bible",
  // Service words: "kikuyu readings for Easter" must not look like a Sunday
  // called "kikuyu easter".
  "kikuyu", "gikuyu", "g\u0129k\u0169y\u0169", "english",
]);

const nameTokens = (value: string): string[] =>
  norm(value)
    .replace(/(\d+)(st|nd|rd|th)\b/g, "$1")
    .split(/[^a-z0-9\u0129\u0169]+/)
    .map((token) => NUMBER_WORDS[token] ?? token)
    .filter((token) => token.length > 0 && !FILLER.has(token));

export interface NameMatch {
  sermon: Sermon;
  score: number;
}

/**
 * Match a Sunday name by token subset, scoring exact matches highest so that
 * "sunday after pentecost" prefers `Sunday after Pentecost` over
 * `Pentecost - Red Mission Sunday`.
 */
export const resolveByName = (text: string, sermons: Sermon[]): NameMatch[] => {
  const asked = nameTokens(text);
  if (!asked.length) return [];

  const matches: NameMatch[] = [];
  for (const sermon of sermons) {
    const tokens = nameTokens(sermon.sundayName ?? "");
    if (!tokens.length) continue;
    if (!asked.every((token) => tokens.includes(token))) continue;
    const extra = tokens.length - asked.length;
    matches.push({ sermon, score: asked.length * 10 - extra });
  }

  return matches.sort(
    (a, b) => b.score - a.score || a.sermon.date.localeCompare(b.sermon.date),
  );
};

/**
 * Keyword retrieval across themes, preachers, Sunday names and notes. Used to
 * ground open-ended questions so the LLM answers from the archive rather than
 * from general knowledge.
 */
export const searchSermons = (text: string, sermons: Sermon[], limit = 3): Sermon[] => {
  const terms = [...new Set(nameTokens(text).filter((token) => token.length >= 3))];
  if (!terms.length) return [];

  const scored = sermons.map((sermon) => {
    const haystack = norm(
      [
        sermon.sundayName,
        sermon.theme ?? "",
        sermon.englishService?.preacher ?? "",
        sermon.kikuyuService?.preacher ?? "",
        sermon.englishService?.notes ?? "",
        sermon.kikuyuService?.notes ?? "",
      ].join(" \n "),
    );

    let score = 0;
    for (const term of terms) {
      let from = 0;
      let hits = 0;
      while (hits < 5) {
        const at = haystack.indexOf(term, from);
        if (at === -1) break;
        hits += 1;
        from = at + term.length;
      }
      // Presence matters most; repetition breaks ties.
      if (hits) score += 1 + hits;
    }
    return { sermon, score };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.sermon.date.localeCompare(a.sermon.date))
    .slice(0, limit)
    .map((entry) => entry.sermon);
};

/* ------------------------------------------------------------------ */
/* Intent                                                             */
/* ------------------------------------------------------------------ */

export const detectService = (text: string): ServiceKey | undefined => {
  const t = norm(text);
  const kikuyu = /\b(kikuyu|gikuyu|g\u0129k\u0169y\u0169)\b/.test(t);
  const english = /\benglish\b/.test(t);
  if (kikuyu && !english) return "kikuyu";
  if (english && !kikuyu) return "english";
  return undefined;
};

/**
 * Signals that a question wants interpretation rather than a lookup. Only these
 * are escalated to the LLM, so "19 July 2026" stays a free, instant answer while
 * "what did the vicar say about stewardship?" gets read properly.
 */
const OPEN_ENDED =
  /\b(why|how|explain\w*|meaning|summar\w*|teach\w*|message|say about|said about|talk about|speak about|lesson|lessons|challenge|challenges|application|reflect\w*)\b/;

export const isOpenEnded = (text: string): boolean => OPEN_ENDED.test(norm(text));

export const detectIntent = (text: string): QueryIntent => {
  const t = norm(text);
  if (/\bnotes?\b|\bmaandiko\b|\bmaand\u0129ko\b|write ?up/.test(t)) return "notes";
  if (/\breadings?\b|\blessons?\b|\bverses?\b|\bscripture\b|\bbible\b|\bibuku\b|\bthoma\b/.test(t)) {
    return "readings";
  }
  if (/\bpreach(er|ed|ing)?\b|\bmurutani\b|\bm\u0169rutani\b|\bspeaker\b|\bvicar\b/.test(t)) {
    return "preacher";
  }
  if (/\bthemes?\b|\btopics?\b|\bsubjects?\b/.test(t)) return "theme";
  if (/\blist\b|\ball sermons\b|\bevery sermon\b|\bwhich sundays?\b|\bhow many\b|\bshow all\b/.test(t)) {
    return "list";
  }
  if (/\bhelp\b|\bwhat can you\b|\bwhat do you do\b|\bhow do you\b/.test(t)) return "help";
  return "unknown";
};

/* ------------------------------------------------------------------ */
/* Conversational continuation                                         */
/* ------------------------------------------------------------------ */

const stripOfferTail = (t: string): string =>
  t
    .replace(/[,\s]+(the\s+)?(sermon\s+)?notes?[.!]*$/, "")
    .replace(/[,\s]+(them|it|that|those)[.!]*$/, "")
    .replace(/[.!]+$/, "")
    .trim();

const AFFIRM_ALL =
  /^(yes|yeah|yep|yup|sure|ok|okay|please|pls|yes please|go ahead|show me|show|indeed|definitely|absolutely|of course|ndio|\u0129\u0129|iii|sawa)(\s+(please|thanks|thank you|sawa))?$/;
const AFFIRM_START =
  /^(yes|yeah|yep|yup|sure|ok|okay|please|pls|go ahead|show me|show|ndio|\u0129\u0129|iii|sawa)\b/;
const DENY_ALL = /^(no|nope|nah|not now|later|no thanks|no thank you|hapana|aca|la|si)$/;
const DENY_START = /^(no|nope|nah|not now|later|hapana|aca|si)\b/;

export const isAffirmative = (text: string): boolean => {
  const t = stripOfferTail(norm(text));
  if (AFFIRM_ALL.test(t)) return true;
  return t.split(/\s+/).filter(Boolean).length <= 4 && AFFIRM_START.test(t);
};

export const isNegative = (text: string): boolean => {
  const t = stripOfferTail(norm(text));
  if (DENY_ALL.test(t)) return true;
  return t.split(/\s+/).filter(Boolean).length <= 4 && DENY_START.test(t);
};

/** Pick one of several candidates by number, ordinal, date or name. */
export const pickCandidate = (text: string, candidates: Sermon[]): Sermon | undefined => {
  const t = norm(text);

  const numeric = t.match(/\b(\d{1,2})\b/);
  if (numeric) {
    const index = +numeric[1];
    if (index >= 1 && index <= candidates.length) return candidates[index - 1];
  }

  const word = t.match(
    /\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|one|two|three|four|five)\b/,
  );
  if (word) {
    const index = +NUMBER_WORDS[word[1]];
    if (index >= 1 && index <= candidates.length) return candidates[index - 1];
  }

  const byDate = resolveByDate(text, candidates);
  if (byDate.length === 1) return byDate[0];

  const byName = resolveByName(t, candidates);
  if (byName.length && byName[0].score > (byName[1]?.score ?? -Infinity)) {
    return byName[0].sermon;
  }

  return undefined;
};

/* ------------------------------------------------------------------ */
/* Resolution                                                          */
/* ------------------------------------------------------------------ */

export const resolveQuery = (
  text: string,
  sermons: Sermon[],
  context: QueryContext = {},
): QueryResult => {
  const t = norm(text);

  // 1. Continue the previous turn before anything else.
  if (context.pendingSermon) {
    if (isAffirmative(t)) return { intent: "notes", sermon: context.pendingSermon };
    if (isNegative(t)) return { intent: "decline", sermon: context.pendingSermon };
  }
  if (context.candidates?.length) {
    const picked = pickCandidate(text, context.candidates);
    if (picked) {
      return {
        intent: "sunday_overview",
        sermon: picked,
        service: detectService(t),
        offerNotes: true,
      };
    }
  }

  const intent = detectIntent(t);
  const service = detectService(t);

  // 2. Resolve which Sunday is being asked about: date, then name, then preacher.
  let matches = resolveByDate(text, sermons);
  let preacher: string | undefined;

  if (!matches.length) {
    // Keep only the best-scoring group: "easter" must prefer `Easter Sunday`
    // over `Third Sunday of Easter`, while "trinity" stays genuinely ambiguous.
    const named = resolveByName(text, sermons);
    if (named.length) {
      const top = named[0].score;
      matches = named.filter((match) => match.score === top).map((match) => match.sermon);
    }
  }
  if (!matches.length) {
    preacher = matchPreacher(text, sermons);
    if (preacher) matches = sermons.filter((s) => sermonPreachers(s).includes(preacher));
  }

  // 3. Nothing matched — fall back to the sermon we were just discussing.
  if (!matches.length) {
    if (context.pendingSermon && intent !== "help" && intent !== "list") {
      if (intent === "notes") return { intent: "notes", sermon: context.pendingSermon };
      if (intent === "readings" || intent === "preacher" || intent === "theme") {
        return { intent, sermon: context.pendingSermon, service, offerNotes: true };
      }
    }
    if (intent === "help") return { intent: "help" };
    if (intent === "list") return { intent: "list", list: sermons };
    if (isOpenEnded(t)) {
      return { intent: "unknown", escalate: true, relevant: searchSermons(text, sermons) };
    }
    if (
      intent === "readings" ||
      intent === "preacher" ||
      intent === "theme" ||
      intent === "notes"
    ) {
      return { intent: "unknown", needsTarget: true };
    }
    return { intent: "unknown" };
  }

  // 4. A preacher with a body of work reads as a list, not a single Sunday.
  if (preacher && matches.length > 1) {
    return { intent: "list", list: matches, preacher, service };
  }

  if (intent === "list") {
    return { intent: "list", list: matches, service };
  }

  // 5. Several Sundays match equally — ask which.
  if (matches.length > 1) {
    return { intent: "sunday_overview", candidates: matches, service };
  }

  // 6. Exactly one Sunday.
  const sermon = matches[0];
  if (intent === "unknown") {
    // A Sunday is identified; only an open-ended question also needs the LLM,
    // and that Sunday is the grounding it reads from.
    const escalate = isOpenEnded(t);
    return {
      intent: "sunday_overview",
      sermon,
      service,
      offerNotes: true,
      escalate,
      relevant: escalate ? [sermon] : undefined,
    };
  }
  if (intent === "notes") return { intent: "notes", sermon, service };
  if (intent === "readings" || intent === "preacher" || intent === "theme") {
    return { intent, sermon, service, offerNotes: true };
  }
  return { intent: "sunday_overview", sermon, service, offerNotes: true };
};

/* ------------------------------------------------------------------ */
/* Presentation and LLM context                                        */
/* ------------------------------------------------------------------ */

/** e.g. "Sunday 18 January 2026" — timezone-safe. */
export const formatSermonDate = (date: string): string =>
  toSermonDate(date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/** The Sunday's name, or its date when the archive records no name. */
export const sermonTitle = (sermon: Sermon): string =>
  (sermon.sundayName ?? "").trim() || formatSermonDate(sermon.date);

/** Compact, grounded context handed to the LLM. */
export const buildSermonContext = (sermon: Sermon, noteLimit = 2000): string => {
  const clip = (value: string) =>
    value.length > noteLimit ? `${value.slice(0, noteLimit)}\u2026` : value;
  const english = canonicalPreacher(sermon.englishService?.preacher) ?? "not recorded";
  const kikuyu = canonicalPreacher(sermon.kikuyuService?.preacher) ?? "not recorded";

  return [
    `Date: ${sermon.date}`,
    `Sunday: ${(sermon.sundayName ?? "").trim() || "(no Sunday name recorded)"}`,
    `Theme: ${(sermon.theme ?? "").trim() || "(no theme recorded)"}`,
    `English Service — preacher: ${english}; readings: ${
      (sermon.englishService?.bibleVerses ?? []).join(", ") || "none recorded"
    }`,
    `Kikuyu Service — preacher: ${kikuyu}; readings: ${
      (sermon.kikuyuService?.bibleVerses ?? []).join(", ") || "none recorded"
    }`,
    "",
    "English Service notes:",
    clip(sermon.englishService?.notes ?? "") || "(none)",
    "",
    "Kikuyu Service notes:",
    clip(sermon.kikuyuService?.notes ?? "") || "(none)",
  ].join("\n");
};

/** Questions offered as chips when the conversation is empty. */
export const SUGGESTIONS = [
  "Readings for 7th Sunday after Trinity",
  "Who preached on 19 July 2026?",
  "What was the theme on Easter Sunday?",
  "Show me sermons by Lay Reader Consolata",
];
