# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

ACK (Anglican Church of Kenya) church website — a content-driven static site built with Vite + React + TypeScript + shadcn-ui + Tailwind CSS. Content is authored as Markdown with YAML frontmatter in `public/content/` and loaded at runtime via `fetch()` (no backend server needed).

## Commands

```sh
npm run dev        # Start dev server on port 8080 (http://localhost:8080)
npm run build      # Type-check (tsc -b) then production build
npm run build:dev  # Type-check then unminified development build
npm run typecheck  # tsc -b only, no bundle output
npm test           # Vitest: query layer, chat client, api/chat handler
npm run preview    # Preview production build locally
npm run lint       # ESLint across the project
```

Tests live next to the code they cover (`src/lib/*.test.ts`). The `api/chat.ts` handler is tested from `src/lib/chatHandler.test.ts` on purpose — Vercel deploys every file in `api/` as a function, so a co-located test would become an endpoint.

The site is deployed via Lovable (the project origin), or via Vercel when the `/ask` chatbot backend is enabled.

## Architecture

**Routing** — react-router-dom v6 in `src/App.tsx`. All routes defined there:

| Path | Page |
|------|------|
| `/` | `Index.tsx` — homepage |
| `/leadership` | `Leadership.tsx` |
| `/ministries` | `Ministries.tsx` |
| `/sermons` | `SermonNotes.tsx` — list of all sermons |
| `/sermons/:id` | `SermonDetail.tsx` — single sermon detail |
| `/ask` | `AskSermons.tsx` — sermon chatbot |
| `/prayer-cells` | `PrayerCells.tsx` |
| `/notices-announcements` | `NoticesAnnouncements.tsx` |
| `*` | `NotFound.tsx` |

**Layout shell** — Every page includes `<TopInfoBar />` + `<MainNavbar />` at the top. The inner pages (`Leadership`, `Ministries`, `PrayerCells`, `NoticesAnnouncements`) share `<SiteFooter />`; `Index.tsx` has its own richer footer.

**Content pipeline** — `src/lib/sermonLoader.ts` is the data layer:
1. `fetchSermonIndex()` → fetches `/content/sermons/index.json` (a `sermons: string[]` of filenames).
2. `fetchSermon(filename)` → fetches the `.md` file, parses YAML frontmatter with `js-yaml`, then splits the body on `## English Service Notes` / `## Kikuyu Service Notes` headings.
3. `fetchAllSermons()` → loads all sermons sorted by date descending.
4. `fetchSermonById(id)` → loads a single sermon by its filename stem (`YYYY-MM-DD`).
5. Filter helpers used by `SermonNotes.tsx`: `getAvailableYears()` / `getSermonsByYear()` and `getAvailableMonths()` / `getSermonsByMonth()`.

> **Sermon dates are date-only.** Never do `new Date(sermon.date)` — `"YYYY-MM-DD"` parses as UTC midnight, so any timezone behind UTC reports the previous day, and occasionally the previous month or year. Use `getSermonDateParts()` for filtering and `toSermonDate()` for display; both read the parts directly and are timezone-safe.

**Sermon chatbot** — `/ask` is answered in two layers:

1. `src/lib/sermonQuery.ts` — pure and deterministic, covered by `sermonQuery.test.ts`. `resolveQuery(text, sermons, context, options)` returns a `QueryResult` describing what to say. It canonicalises preacher names through an explicit alias table (**never merge by surname** — the archive holds two different Nyokabis), parses dates without `new Date(string)`, matches Sunday names by token so `trinity 7` finds `7th Sunday After Trinity`, and reports ambiguity instead of guessing.
2. `api/chat.ts` — a Vercel function that holds the LLM key. It answers strictly from the extracts the client sends. `src/lib/askApi.ts` treats every failure as `null`, so the page degrades to the deterministic answer instead of showing an error.

**Escalation is driven by the shape of the question, not by the intent bucket.** `QueryResult.escalate` comes from `isOpenEnded()`; do not gate it on `intent === "unknown"`, or any question containing "notes", "readings" or "theme" will silently skip the LLM and appear to be archive-only. `/ask` passes `{ ai: "off" | "auto" | "always" }` from its mode switch — `off` is archive-only, `auto` escalates open-ended questions, `always` escalates everything. Whenever `escalate` is true, `relevant` must carry the grounding sermons.

Sunday-name matching ignores tokens that appear in no Sunday name (the `resolveByName` vocabulary). That is what keeps a question's own wording — "Summarise the theme of Easter Sunday" — from hiding the Sunday it names. Prefer that over extending the stop-word list.

> **Never expose a secret to Vite.** Only `VITE_*` variables reach the browser bundle. The LLM key must stay on `LLM_API_KEY`, which only the function reads; a `VITE_LLM_API_KEY` would publish it to every visitor. See `.env.example`.

Sermon notes must be rendered through `SermonNotesBody`, which `/sermons/:id` and the chatbot share, rather than a second markdown renderer.

**Theming** — Navy & Gold palette defined as CSS custom properties in `src/index.css` under `@layer base { :root { … } .dark { … } }`. Key utility classes: `.bg-navy`, `.bg-gold`, `.text-gold`, `.text-navy`, `.border-gold`, `.text-gradient-gold`. Fonts: Playfair Display (headings) and Open Sans (body), loaded from `@fontsource`.

**UI components** — shadcn-ui in `src/components/ui/` (generated by `components.json`). Path alias `@/` maps to `./src/`.

## Cursor / Context7 rule

When working with libraries, frameworks, or APIs, use Context7 MCP to fetch current documentation instead of relying on training data:
1. Call `resolve-library-id` with the library name and question.
2. Pick the best match — prefer exact names and version-specific IDs.
3. Call `query-docs` with the selected library ID and question.
4. Answer using fetched docs with code examples and version citations.

## Content authoring — Sermons

Sermons live in `public/content/sermons/` as `.md` files with YAML frontmatter. See `TEMPLATE.md` in that directory.

**Frontmatter structure:**
```yaml
---
id: "YYYY-MM-DD"
date: "YYYY-MM-DD"
sundayName: "Sunday Name"
theme: "Optional theme"
englishService:
  preacher: "Name"
  bibleVerses:
    - "Book Chapter:Verses"
  pdfUrl: "/content/assets/filename.pdf"  # optional
kikuyuService:
  preacher: "Name"
  bibleVerses:
    - "Book Chapter:Verses"
  pdfUrl: "/content/assets/filename.pdf"  # optional
---
```

The body must contain the two headings exactly: `## English Service Notes` and `## Kikuyu Service Notes`. Notes support a simple markdown subset rendered by `renderMarkdown()` in `SermonDetail.tsx`: headings (`##`, `###`), blockquotes (`>`), unordered lists (`-`), numbered lists (`1.`), and bold (`**text**`).

**Canonical body format** — every sermon body must follow this shape (note the pattern of bold labels then the `###` heading before the notes):

```
## English Service Notes

**Preacher:** <name>
**Bible Verses:** <all verses joined with commas>
**Theme:** <theme text, omit this line if theme is empty>
### Sermon Notes

<notes content>
```

```
## Kikuyu Service Notes

**Mũrutani:** <name>
**Gũthoma Ibuku:** <all verses joined with commas>
**Theme:** <theme text, omit this line if theme is empty>
### Maandĩko ma Ũhoro

<notes content>
```

**To add a new sermon:**
1. Copy `TEMPLATE.md`, name it `YYYY-MM-DD.md`, fill in frontmatter and notes.
2. Add the filename to the `sermons` array in `index.json` (newest first).
3. Commit both files.

**Troubleshooting:** If a sermon doesn't appear, check that the filename is in `index.json`, the file exists in `public/content/sermons/`, and the YAML frontmatter is valid (no tabs, correct indentation, `bibleVerses` must be an array even if empty: `[]`).

## Branding

- **Page title and meta tags** — set in `index.html`. Title: `ACK St Stephen's Church`.
- **Favicon** — `public/favicon.svg` (gold cross, no background). Modern browsers support SVG favicons directly.

## PDF files

Sermon PDFs are stored in `public/content/assets/`. Reference them in frontmatter as `pdfUrl: "/content/assets/filename.pdf"`.
