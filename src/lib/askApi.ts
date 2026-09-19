import { buildSermonContext } from "@/lib/sermonQuery";
import type { Sermon } from "@/lib/sermonLoader";

/**
 * Client for the optional LLM layer (api/chat.ts).
 *
 * This is deliberately best-effort: the deterministic query layer answers every
 * structured question, so the LLM only adds narrative colour to open-ended ones.
 * Any failure — no function deployed, missing key, rate limit, bad response —
 * resolves to `null` and the page falls back to its own reply. Nothing here ever
 * surfaces an error to the visitor.
 */

const ENDPOINT: string = import.meta.env.VITE_CHAT_API_URL || "/api/chat";

const TIMEOUT_MS = 20000;

export interface AskRequest {
  question: string;
  /** Plain-text sermon extracts the answer must be grounded in. */
  context: string[];
}

export interface AskResponse {
  answer: string;
}

export const askAi = async (question: string, sermons: Sermon[]): Promise<string | null> => {
  if (!sermons.length && !question.trim()) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const payload: AskRequest = {
      question,
      context: sermons.map((sermon) => buildSermonContext(sermon)),
    };

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) return null;

    // In `npm run dev` there is no serverless function, and Vite can answer an
    // unknown path with index.html. Checking the content type stops us trying to
    // parse the app shell as JSON.
    const contentType = response.headers?.get?.("content-type") ?? "";
    if (!contentType.includes("application/json")) return null;

    const data = (await response.json()) as Partial<AskResponse>;
    const answer = typeof data?.answer === "string" ? data.answer.trim() : "";
    return answer || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};
