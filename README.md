# A.C.K. St. Stephen's Church Gatuanyaga

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Radix_UI-000000?logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Diocese](https://img.shields.io/badge/Diocese-ACK_Diocese_of_Thika-1c2b4a)](https://ack-kenya.org/)

The official website and digital parish portal for **A.C.K. St. Stephen's Church Gatuanyaga**, under the **A.C.K. Diocese of Thika**, Anglican Church of Kenya (ACK).

The site serves as a visitor-first spiritual home, a weekly liturgical bulletin, and a bilingual digital archive for Sunday sermon notes and parish life.

---

## Table of Contents

- [Parish Mission & Identity](#parish-mission--identity)
- [Weekly Sunday Services](#weekly-sunday-services)
- [Key Features](#key-features)
- [Content Architecture & Sermon Pipeline](#content-architecture--sermon-pipeline)
  - [How to Author & Publish a Sermon](#how-to-author--publish-a-sermon)
  - [Canonical Sermon Format](#canonical-sermon-format)
- [Tech Stack](#tech-stack)
- [Project Directory Structure](#project-directory-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Available Scripts](#available-scripts)
- [Design System & Branding](#design-system--branding)
  - [Color Palette](#color-palette)
  - [Typography](#typography)
- [Parish Contact & Location](#parish-contact--location)

---

## Parish Mission & Identity

- **Core Mission**: *"United in Christ, serving our community with love and compassion."*
- **Parish Motto**: *"I can do all things through Christ"* (Philippians 4:13)
- **Yearly Theme**: *"And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others."* — **2 Timothy 2:2**
- **Proclamation**: *"FOR US AND FOR OUR SALVATION"*

---

## Weekly Sunday Services

Worship takes place every Sunday across three distinct services catering to our multilingual, intergenerational congregation:

| Service | Time | Language / Focus | Highlights |
|:---|:---|:---|:---|
| **Express Service** | 7:00 AM – 8:15 AM | English & Liturgy | Contemplative early morning prayer, Holy Communion |
| **English Service** | 8:30 AM – 10:15 AM | English | Family worship, contemporary & choral praise, Sunday School |
| **Kikuyu Service** | 10:30 AM – 12:30 PM | Gĩkũyũ | Traditional Anglican liturgy in Gĩkũyũ, hymns, community fellowship |

---

## Key Features

1. **Modern Visitor-First Hub**:
   - Impactful hero with yearly theme banner, service times action shortcuts, and church aerial view.
   - Sunday service cards detailing times, languages, and first-time visitor guidance.
   - Pastoral welcome from **Rev. Henry Kinyua** (Vicar In Charge) with the signature gold cross emblem.
2. **Bilingual Sermon Notes Archive (`/sermons` & `/sermons/:id`)**:
   - Zero-backend static content pipeline loading Markdown with YAML frontmatter at runtime.
   - Dual-column reading experience pairing **English Service Notes** with **Kikuyu Service Notes (`Maandĩko ma Ũhoro`)**.
   - Filtering by year and by calendar month (chronological month pills, showing only the months the archive actually holds), with preacher names, scriptural readings, and optional PDF downloads shown on each entry.
3. **Clergy & Lay Leadership Showcase (`/leadership`)**:
   - Vicar In Charge spotlight with framed portrait.
   - Interactive carousel of licensed parish Lay Readers: Margaret, Consolata, Lydia, Francis, and Damaris.
4. **Parish Ministries Matrix (`/ministries`)**:
   - Comprehensive directory for **KAMA** (Kenya Anglican Men's Association), **Mothers Union** (Christian Care for Families), **KAYO** (Youth Ministry), **Children's Ministry (Sunday School)**, **Daughters of Zion (Choir)**, and **Bible Study Groups**.
5. **Kanisa Mashinani / Home Prayer Cells (`/prayer-cells`)**:
   - Neighborhood fellowship groups for midweek intercession and discipleship: **Afilipi**, **Athesalonike**, **Jerusalem**, **Macedonia**, and **Berea**.
6. **Parish Notices & Announcements (`/notices-announcements`)**:
   - A notices and communication page with empty states ready to receive parish announcements. Content is added by hand; there is no notices data pipeline yet.
7. **Parish Stewardship & Giving**:
   - Guidance for tithes, offerings, thanksgiving, and church development projects rooted in 2 Corinthians 9:7.

---

## Content Architecture & Sermon Pipeline

The website uses a **zero-backend static content architecture**. Content is authored as Markdown (`.md`) files with YAML frontmatter in [`public/content/sermons/`](public/content/sermons/) and fetched at runtime by [`src/lib/sermonLoader.ts`](src/lib/sermonLoader.ts). No database or external server is required.

```
public/content/sermons/
├── index.json          # Master list of published sermon files (sorted newest first)
├── TEMPLATE.md         # Reference template for editors
├── 2026-07-19.md       # Individual sermon (named by date: YYYY-MM-DD.md)
├── ...
└── schedule-notes.md   # Service schedule notes (not part of the sermon index)
public/content/assets/
└── May 17 English Service Sermon.pdf   # Optional printable bulletin / sermon PDF
```

### How to Author & Publish a Sermon

1. **Create the file**: Duplicate [`public/content/sermons/TEMPLATE.md`](public/content/sermons/TEMPLATE.md) and name it using the date format `YYYY-MM-DD.md` (e.g. `2026-07-26.md`).
2. **Fill in frontmatter**: Specify the date, liturgical Sunday name (e.g., *8th Sunday After Trinity*), optional theme, preachers, and Bible verses.
3. **Add the sermon notes**: Write the English notes under `## English Service Notes` and the Kikuyu notes under `## Kikuyu Service Notes`.
4. **Update the index**: Add the filename to the `sermons` array in [`public/content/sermons/index.json`](public/content/sermons/index.json) at the very top (newest first):
   ```json
   {
     "sermons": [
       "2026-07-26.md",
       "2026-07-19.md"
     ]
   }
   ```
5. **Commit & Deploy**: Commit the new `.md` file and `index.json` together and push to GitHub. Production publishing is done through **Lovable** (the project origin), which is linked to this repository.

### Canonical Sermon Format

Every sermon body follows this structure. All 28 published sermons conform to it; the example below is abridged (the real notes are longer).

```yaml
---
id: "2026-07-19"
date: "2026-07-19"
sundayName: "7th Sunday After Trinity"
theme: "Mission in the Workplace"
englishService:
  preacher: "Vicar Henry Kinyua"
  bibleVerses:
    - "Nehemiah 2:1-10"
    - "Mark 16:10-20"
  pdfUrl: "/content/assets/May%2017%20English%20Service%20Sermon.pdf" # Optional
kikuyuService:
  preacher: "Vicar Henry Kinyua"
  bibleVerses:
    - "Nehemia 2:1-10"
    - "Mariko 16:10-20"
  pdfUrl: "" # Optional
---

## English Service Notes

**Preacher:** Vicar Henry Kinyua
**Bible Verses:** Nehemiah 2:1-10, Mark 16:10-20
**Theme:** Mission in the Workplace
### Sermon Notes

1. God is calling us to move towards mission work.
2. We fail to do mission work because of fear.
3. Willingness to do mission work receives Heavenly backing.

---

## Kikuyu Service Notes

**Mũrutani:** Vicar Henry Kinyua
**Gũthoma Ibuku:** Nehemia 2:1-10, Mariko 16:10-20
**Theme:** Umisheni wiraini witu
### Maandĩko ma Ũhoro

1. Ngai nĩaratwĩta twerekere wĩra wa ũmisheni.
2. Tũremagwo nĩ wĩra wa ũmisheni tondũ wa guoya.
3. Kwĩheana wĩraini wa Ngai kũreheaga ũteithio kuuma igũrũ.
```

**Field notes:**

- `sundayName` and `theme` are empty for a few older entries. Keep the key present with `""` rather than deleting the line.
- If a service did not take place, or its notes were not recorded, keep *both* section headings and use an explicit line such as `**Bible Verses:** None` plus a one-line explanation — do not leave a section blank or drop a heading.
- `pdfUrl` is optional per service. Point it at a file in `public/content/assets/`, URL-encoding spaces (e.g. `/content/assets/May%2017%20English%20Service%20Sermon.pdf`).
- Both bodies must begin with the three bold label lines (`**Preacher:**` / `**Bible Verses:**` / `**Theme:**` for English; `**Mũrutani:**` / `**Gũthoma Ibuku:**` / `**Theme:**` for Kikuyu) followed immediately by the `### Sermon Notes` / `### Maandĩko ma Ũhoro` heading.

---

## Tech Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| **Runtime & Framework** | React 18, Vite 5 | Fast development and optimized SPA client builds |
| **Language** | TypeScript 5 | End-to-end type safety across components and data loaders |
| **Routing** | React Router DOM v6 | Client-side routing with deep linking (`/sermons/:id`) |
| **Styling** | Tailwind CSS 3.4, PostCSS | Custom utility classes, theme variables, responsive design |
| **UI Components** | shadcn/ui (Radix UI) | Accessible, unstyled primitives (Dialogs, Menus, Selects) |
| **Typography** | Fontsource | Self-hosted *Playfair Display* (headings) & *Open Sans* (body) |
| **Icons** | Lucide React | Clean, lightweight icon suite |
| **Content Parser** | `js-yaml` | In-browser parsing of YAML frontmatter from `.md` files |
| **Date Utilities** | `date-fns` | Calendar date formatting for sermon listings |
| **Data Fetching** | `@tanstack/react-query` | Query client caching and lifecycle management |

---

## Project Directory Structure

```
ack-church-website/
├── public/
│   ├── content/
│   │   ├── assets/           # Sermon and bulletin PDF downloads
│   │   └── sermons/          # Sunday sermon markdown files & index.json
│   ├── images/
│   │   ├── leaders/          # Clergy and lay reader portrait photos
│   │   ├── ministries/       # KAMA, Mothers Union, and KAYO official logos
│   │   ├── ack-diocese-logo.png
│   │   ├── church-leaders-group.jpg  # Group clergy portrait
│   │   └── church1.png       # Church aerial view
│   ├── favicon.svg           # Liturgical gold cross SVG favicon
│   └── robots.txt
├── src/
│   ├── assets/               # Photographic assets (church-leaders.jpg, members-seekers.jpg)
│   ├── components/
│   │   ├── ui/               # shadcn/ui component primitives
│   │   ├── TopInfoBar.tsx    # Parish email, telephone, and social icon placeholders
│   │   ├── MainNavbar.tsx    # Responsive sticky header with navigation
│   │   ├── HeroSection.tsx   # Visitor hero with theme scripture
│   │   ├── SundayServicesSection.tsx # 3-service cards (Express, English, Kikuyu)
│   │   ├── VicarWelcomeSection.tsx   # Pastoral message from Rev. Henry Kinyua
│   │   ├── LatestSermonSpotlight.tsx # Dynamic latest sermon feature
│   │   ├── ChurchLeadersSection.tsx  # Clergy and lay readers carousel
│   │   └── SiteFooter.tsx            # Shared footer used by the inner pages
│   ├── hooks/                # Mobile and toast utility hooks
│   ├── lib/
│   │   ├── sermonLoader.ts   # Core data pipeline: fetches and parses sermons
│   │   └── utils.ts          # Tailwind merge & className utility
│   ├── pages/
│   │   ├── Index.tsx         # Modern visitor-first homepage
│   │   ├── Leadership.tsx    # Church leadership page
│   │   ├── Ministries.tsx    # Parish ministries directory
│   │   ├── SermonNotes.tsx   # All sermon notes with year + month filters
│   │   ├── SermonDetail.tsx  # Bilingual side-by-side sermon reading view
│   │   ├── PrayerCells.tsx   # Kanisa Mashinani home prayer cells
│   │   ├── NoticesAnnouncements.tsx # Parish announcements
│   │   └── NotFound.tsx      # 404 handler
│   ├── App.tsx               # Root component with router definitions
│   ├── index.css             # HSL CSS theme custom properties
│   └── main.tsx              # Application entry point
├── tailwind.config.ts        # Custom colors (navy, gold, cream) and font families
├── vite.config.ts            # Vite bundler configuration
├── eslint.config.js          # ESLint flat config
├── components.json           # shadcn/ui generator configuration
├── postcss.config.js         # PostCSS pipeline for Tailwind
├── tsconfig.json             # TypeScript project references
├── tsconfig.app.json         # App compiler options
├── tsconfig.node.json        # Vite config compiler options
├── claude.md                 # Contributor and agent guidance notes
└── package.json              # Project dependencies and npm scripts
```

---

## Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher (tested with `v24.x`)
- **npm** (`v9+`), **pnpm**, or **bun**

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/acridsoul/ack-church-website.git
   cd ack-church-website
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Available Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | Starts the Vite local development server on [http://localhost:8080](http://localhost:8080) with hot module replacement |
| `npm run build` | Type-checks with `tsc -b`, then creates an optimized production bundle in `dist/` |
| `npm run build:dev` | Type-checks, then builds in development mode (unminified) |
| `npm run typecheck` | Runs `tsc -b` only, with no bundle output |
| `npm run preview` | Starts a local web server to preview the production build output |
| `npm run lint` | Runs ESLint across all TypeScript and React files |

---

## Design System & Branding

The design system blends Anglican ecclesiastical dignity with accessible modern web typography.

### Color Palette

Defined in [`src/index.css`](src/index.css) as CSS custom properties and extended in [`tailwind.config.ts`](tailwind.config.ts):

| Token | Class | HSL Value | Hex Equivalent | Description |
|:---|:---|:---|:---|:---|
| **Navy** | `bg-navy`, `text-navy` | `hsl(220, 45%, 20%)` | `#1c2b4a` | Primary authority, headers, and hero canvas |
| **Navy Dark** | `bg-navy-dark` | `hsl(220, 50%, 12%)` | `#0f1a2e` | Deep footer and high-contrast surfaces |
| **Navy Light** | `bg-navy-light` | `hsl(220, 35%, 30%)` | `#324467` | Hover states on navy buttons |
| **Church Gold** | `bg-gold`, `text-gold` | `hsl(42, 70%, 50%)` | `#d9a326` | Liturgical gold accent, icons, cross badges |
| **Gold Light** | `bg-gold-light` | `hsl(42, 75%, 65%)` | `#e9c163` | Gradient terminus and glowing hover states |
| **Gold Dark** | `bg-gold-dark` | `hsl(42, 65%, 40%)` | `#a88124` | Active borders and button accents |
| **Ecclesiastical Cream**| `bg-cream` | `hsl(45, 30%, 96%)` | `#f8f6f2` | Warm secondary card and section background |

> The favicon (`public/favicon.svg`) uses a standalone gold, `#cc9a33`, rather than the `--gold` token above.

### Typography

- **Headings & Proclamations**: `"Playfair Display", Georgia, serif` (`font-display`)
  - Conveys classic liturgical elegance, used for titles, sermon themes, and scripture quotes.
- **Body & UI Elements**: `"Open Sans", system-ui, sans-serif` (`font-body`)
  - Ensures clean readability across desktop and mobile screens for service times, sermon text, and navigation.

---

## Parish Contact & Location

- **Church**: A.C.K. St. Stephen's Church Gatuanyaga
- **Diocese**: A.C.K. Diocese of Thika
- **Physical Address**: Gatuanyaga, Thika, Kenya
- **Email**: [ackststephenschurch@gmail.com](mailto:ackststephenschurch@gmail.com)
- **Phone**: `+254-7xxxxxxxx` *(placeholder — replace with the parish line)*

---

&copy; 2026 A.C.K. St. Stephen's Church Gatuanyaga. All rights reserved.  
*Diocese of Thika &bull; Anglican Church of Kenya*
