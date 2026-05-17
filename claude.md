Agent instructions — Adding a Sunday sermon

Purpose
- Short reference for agents or contributors adding a new Sunday sermon file and updating the index.

Files & locations
- `public/content/sermons/` — sermon `.md` files, `index.json`, `TEMPLATE.md`.
- `src/lib/sermonLoader.ts` — code that reads `index.json` and parses each `.md`'s frontmatter and notes.

Step-by-step: Add a new Sunday sermon
1. Create the file
   - Create a new file named with the Sunday date: `YYYY-MM-DD.md` (example: `2026-05-24.md`) inside `public/content/sermons/`.
   - Copy the contents of `TEMPLATE.md` as the starting point.

2. Update frontmatter
   - Required frontmatter keys (YAML):
     - `id`: string, use the same value as the filename without extension (e.g. `"2026-05-24"`).
     - `date`: string, `YYYY-MM-DD`.
     - `sundayName`: short name (e.g. `Sunday after Pentecost`).
     - `theme`: optional string.
     - `englishService` and `kikuyuService`: each should include at least `preacher` and `bibleVerses` (array). `pdfUrl` is optional.
   - Example frontmatter:

```yaml
---
id: "2026-05-24"
date: "2026-05-24"
sundayName: "Pentecost"
theme: "Receiving the Spirit"
englishService:
  preacher: "Pastor Name"
  bibleVerses:
    - "Acts 2:1-21"
  pdfUrl: "https://example.com/notes.pdf"
kikuyuService:
  preacher: "Mũrutani Name"
  bibleVerses:
    - "Acts 2:1-21"
---
```

3. Fill notes sections
   - Below the frontmatter include the two headings exactly as in the template:
     - `## English Service Notes`
     - `## Kikuyu Service Notes`
   - Put the notes content under each heading. If you do not have content yet, keep placeholders (TBC).

4. Update `index.json`
   - Open `public/content/sermons/index.json` and add the filename (`YYYY-MM-DD.md`) to the `sermons` array.
   - Convention: place the newest file at the start of the array so it appears first. Example:

```json
{
  "sermons": [
    "2026-05-24.md",
    "2026-05-17.md",
    "2026-05-10.md"
  ]
}
```

5. Commit & deploy
   - Commit the new `.md` and the updated `index.json` and push to the repo.
   - Optionally run `npm run dev` and open the dev server to preview the update.

Notes & checks
- `src/lib/sermonLoader.ts` fetches `/content/sermons/index.json` and then each `.md`. It expects valid YAML frontmatter and splits the body into English/Kikuyu sections.
- Ensure `bibleVerses` is a YAML array (even if empty: `[]`) to avoid parsing issues.
- Date format must be `YYYY-MM-DD`.
- If the site shows `TBC`, confirm frontmatter values are filled or left intentionally as placeholders.

Troubleshooting
- If a sermon is not showing up: verify the filename appears in `index.json`, the file exists in `public/content/sermons/`, and the YAML frontmatter is valid (no tabs, correct indentation).

Contact
- Ask the repository maintainer before renaming or deleting old sermon files.
