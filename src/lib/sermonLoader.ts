import yaml from "js-yaml";

export interface SermonService {
  preacher: string;
  bibleVerses: string[];
  notes: string;
  pdfUrl?: string;
}

export interface Sermon {
  id: string;
  date: string;
  sundayName: string;
  theme?: string;
  englishService: SermonService;
  kikuyuService: SermonService;
}

interface SermonFrontmatter {
  id: string;
  date: string;
  sundayName: string;
  theme?: string;
  englishService: {
    preacher: string;
    bibleVerses: string[];
    pdfUrl?: string;
  };
  kikuyuService: {
    preacher: string;
    bibleVerses: string[];
    pdfUrl?: string;
  };
}

interface SermonIndex {
  sermons: string[];
}

const parseFrontmatter = (rawContent: string): { data: SermonFrontmatter; content: string } => {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = rawContent.match(frontmatterRegex);
  
  if (match) {
    const frontmatter = yaml.load(match[1]) as SermonFrontmatter;
    const body = rawContent.slice(match[0].length).trim();
    return { data: frontmatter, content: body };
  }
  
  throw new Error("Invalid frontmatter format");
};

const parseSermonContent = (content: string): { english: string; kikuyu: string } => {
  let englishNotes = "";
  let kikuyuNotes = "";
  
  // Find sections by looking for the headers
  const englishMatch = content.match(/## English Service Notes\s*([\s\S]*?)(?=---\s*## Kikuyu Service Notes|$)/);
  const kikuyuMatch = content.match(/## Kikuyu Service Notes\s*([\s\S]*?)$/);
  
  if (englishMatch) {
    englishNotes = englishMatch[1].trim();
  }
  if (kikuyuMatch) {
    kikuyuNotes = kikuyuMatch[1].trim();
  }
  
  // Fallback: use whole content for English if no sections found
  if (!englishNotes && !kikuyuNotes) {
    englishNotes = content.trim();
  }
  
  return { english: englishNotes, kikuyu: kikuyuNotes };
};

export const fetchSermonIndex = async (): Promise<string[]> => {
  const response = await fetch("/content/sermons/index.json");
  if (!response.ok) {
    throw new Error("Failed to fetch sermon index");
  }
  const data: SermonIndex = await response.json();
  return data.sermons;
};

export const fetchSermon = async (filename: string): Promise<Sermon> => {
  const response = await fetch(`/content/sermons/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch sermon: ${filename}`);
  }
  
  const rawContent = await response.text();
  const { data: frontmatter, content } = parseFrontmatter(rawContent);
  const { english, kikuyu } = parseSermonContent(content);
  
  return {
    id: frontmatter.id,
    date: frontmatter.date,
    sundayName: frontmatter.sundayName,
    theme: frontmatter.theme,
    englishService: {
      preacher: frontmatter.englishService.preacher,
      bibleVerses: frontmatter.englishService.bibleVerses,
      notes: english,
      pdfUrl: frontmatter.englishService.pdfUrl,
    },
    kikuyuService: {
      preacher: frontmatter.kikuyuService.preacher,
      bibleVerses: frontmatter.kikuyuService.bibleVerses,
      notes: kikuyu,
      pdfUrl: frontmatter.kikuyuService.pdfUrl,
    },
  };
};

export const fetchAllSermons = async (): Promise<Sermon[]> => {
  const filenames = await fetchSermonIndex();
  const sermons = await Promise.all(filenames.map(fetchSermon));
  // Sort by date descending
  return sermons.sort((a, b) => toSermonDate(b.date).getTime() - toSermonDate(a.date).getTime());
};

export const fetchSermonById = async (id: string): Promise<Sermon | null> => {
  try {
    const filename = `${id}.md`;
    return await fetchSermon(filename);
  } catch {
    return null;
  }
};

/**
 * Sermon dates are plain `YYYY-MM-DD` calendar dates with no time or zone.
 * `new Date("2026-02-01")` parses as UTC midnight, which shifts the day — and
 * sometimes the month or year — in any timezone behind UTC. Read the parts directly.
 */
export const getSermonDateParts = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month: month - 1, day };
};

/** Local-midnight Date for a sermon's calendar date, safe for display formatting. */
export const toSermonDate = (date: string): Date => {
  const { year, month, day } = getSermonDateParts(date);
  return new Date(year, month, day);
};

export const getSermonsByYear = (sermons: Sermon[], year: number): Sermon[] => {
  return sermons.filter((sermon) => getSermonDateParts(sermon.date).year === year);
};

export const getAvailableYears = (sermons: Sermon[]): number[] => {
  const years = sermons.map((sermon) => getSermonDateParts(sermon.date).year);
  return [...new Set(years)].sort((a, b) => b - a);
};

/** Calendar months (0 = January) that actually contain a sermon, in calendar order. */
export const getAvailableMonths = (sermons: Sermon[]): number[] => {
  const months = sermons.map((sermon) => getSermonDateParts(sermon.date).month);
  return [...new Set(months)].sort((a, b) => a - b);
};

export const getSermonsByMonth = (sermons: Sermon[], month: number): Sermon[] => {
  return sermons.filter((sermon) => getSermonDateParts(sermon.date).month === month);
};
