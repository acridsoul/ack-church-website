import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import TopInfoBar from "@/components/TopInfoBar";
import MainNavbar from "@/components/MainNavbar";
import SiteFooter from "@/components/SiteFooter";
import SermonNotesBody from "@/components/SermonNotesBody";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useSermons } from "@/hooks/useSermons";
import { askAi } from "@/lib/askApi";
import {
  canonicalPreacher,
  formatSermonDate,
  resolveQuery,
  sermonTitle,
  SUGGESTIONS,
  type QueryIntent,
  type QueryResult,
  type ServiceKey,
} from "@/lib/sermonQuery";
import type { Sermon, SermonService } from "@/lib/sermonLoader";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Loader2,
  Send,
  Sparkles,
  User,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Conversation model                                                  */
/* ------------------------------------------------------------------ */

interface UserTurn {
  id: string;
  role: "user";
  text: string;
}

interface AssistantTurn {
  id: string;
  role: "assistant";
  result: QueryResult;
  /** Narrative answer from the optional LLM layer. */
  aiText?: string;
  aiPending?: boolean;
  aiUnavailable?: boolean;
  notesOpen?: boolean;
}

type Turn = UserTurn | AssistantTurn;

let turnSeq = 0;
const nextId = () => `turn-${(turnSeq += 1)}`;

const MAX_LIST = 8;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Answer pieces                                                       */
/* ------------------------------------------------------------------ */

const ServiceBlock = ({
  label,
  service,
  intent,
}: {
  label: string;
  service: SermonService;
  intent: QueryIntent;
}) => {
  const preacher = canonicalPreacher(service.preacher);
  const readings = (service.bibleVerses ?? []).filter(Boolean);

  return (
    <div className="space-y-2">
      <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-body">{label}</h4>
      <div className="flex items-start gap-2 text-sm font-body">
        <User className="w-4 h-4 text-gold mt-0.5 shrink-0" />
        <span
          className={cn(
            "text-foreground/90",
            intent === "preacher" && "font-semibold text-foreground",
          )}
        >
          {preacher ?? "No preacher recorded"}
        </span>
      </div>
      <div className="flex items-start gap-2 text-sm font-body">
        <BookOpen className="w-4 h-4 text-gold mt-0.5 shrink-0" />
        {readings.length ? (
          <span className="flex flex-wrap gap-1.5">
            {readings.map((verse) => (
              <span
                key={verse}
                className={cn(
                  "bg-gold/10 text-navy px-2 py-0.5 rounded font-medium",
                  intent === "readings" && "bg-gold/25 font-semibold",
                )}
              >
                {verse}
              </span>
            ))}
          </span>
        ) : (
          <span className="text-muted-foreground">No readings recorded</span>
        )}
      </div>
    </div>
  );
};

const SermonCard = ({
  sermon,
  service,
  intent,
  notesOpen,
  onOpenNotes,
  onDecline,
  busy,
}: {
  sermon: Sermon;
  service?: ServiceKey;
  intent: QueryIntent;
  notesOpen?: boolean;
  onOpenNotes?: () => void;
  onDecline?: () => void;
  busy?: boolean;
}) => {
  const showEnglish = service !== "kikuyu";
  const showKikuyu = service !== "english";
  const hasNotes =
    (showEnglish && !!sermon.englishService.notes?.trim()) ||
    (showKikuyu && !!sermon.kikuyuService.notes?.trim());

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="bg-navy/5 border-b border-border p-4">
        <div className="flex items-center gap-2 text-gold text-sm font-body">
          <Calendar className="w-4 h-4" />
          <span>{formatSermonDate(sermon.date)}</span>
        </div>
        <h3 className="font-display text-xl text-foreground mt-1">{sermonTitle(sermon)}</h3>
        {sermon.theme?.trim() && (
          <p
            className={cn(
              "text-muted-foreground text-sm font-body mt-1",
              intent === "theme" && "text-foreground font-semibold",
            )}
          >
            Theme: <span className="text-foreground font-semibold">{sermon.theme}</span>
          </p>
        )}
      </div>

      <div className="p-4 space-y-4">
        {showEnglish && (
          <ServiceBlock label="English Service" service={sermon.englishService} intent={intent} />
        )}
        {showKikuyu && (
          <ServiceBlock label="Kikuyu Service" service={sermon.kikuyuService} intent={intent} />
        )}

        {notesOpen && (
          <div className="border-t border-border pt-4 space-y-6">
            {showEnglish && sermon.englishService.notes?.trim() && (
              <div>
                <h4 className="text-xs uppercase tracking-wide text-gold font-body mb-2">
                  English Service Notes
                </h4>
                <SermonNotesBody content={sermon.englishService.notes} />
              </div>
            )}
            {showKikuyu && sermon.kikuyuService.notes?.trim() && (
              <div>
                <h4 className="text-xs uppercase tracking-wide text-gold font-body mb-2">
                  Maandĩko ma Ũhoro
                </h4>
                <SermonNotesBody content={sermon.kikuyuService.notes} />
              </div>
            )}
            <Link
              to={`/sermons/${sermon.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold transition-colors font-body"
            >
              Open the full notes page
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {!notesOpen && hasNotes && onOpenNotes && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-cream border border-gold/40 p-3">
            <p className="text-sm font-body text-navy">Would you like the sermon notes?</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="gold" onClick={onOpenNotes} disabled={busy}>
                Yes, show the notes
              </Button>
              {onDecline && (
                <Button size="sm" variant="ghost" onClick={onDecline} disabled={busy}>
                  Not now
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SuggestionChips = ({ onPick, busy }: { onPick: (text: string) => void; busy: boolean }) => (
  <div className="flex flex-wrap gap-2">
    {SUGGESTIONS.map((suggestion) => (
      <button
        key={suggestion}
        type="button"
        onClick={() => onPick(suggestion)}
        disabled={busy}
        className={cn(
          "rounded-full border border-border bg-transparent px-3.5 py-1 text-xs sm:text-sm font-semibold font-body",
          "text-foreground/80 transition-colors hover:border-gold/60 hover:bg-gold/5 hover:text-navy",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
        )}
      >
        {suggestion}
      </button>
    ))}
  </div>
);

const AssistantText = ({ children }: { children: ReactNode }) => (
  <div className="rounded-2xl rounded-bl-sm bg-cream border border-border px-4 py-3 font-body text-sm text-foreground/90">
    {children}
  </div>
);

type AnswerMode = "ai" | "archive";

const MODES: Array<{ value: AnswerMode; label: string }> = [
  { value: "ai", label: "Archive + AI" },
  { value: "archive", label: "Archive only" },
];

const ModeToggle = ({
  mode,
  onChange,
  disabled,
}: {
  mode: AnswerMode;
  onChange: (mode: AnswerMode) => void;
  disabled?: boolean;
}) => (
  <div
    role="radiogroup"
    aria-label="How answers are produced"
    className="inline-flex items-center gap-0.5 rounded-full border border-border bg-background p-0.5"
  >
    {MODES.map(({ value, label }) => (
      <button
        key={value}
        type="button"
        role="radio"
        aria-checked={mode === value}
        disabled={disabled}
        onClick={() => onChange(value)}
        className={cn(
          "rounded-full px-3 py-1 text-xs font-semibold font-body transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
          mode === value
            ? "bg-navy text-cream"
            : "text-foreground/70 hover:text-navy",
          disabled && "opacity-50 pointer-events-none",
        )}
      >
        {label}
      </button>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const AskSermons = () => {
  const { data: sermons = [], isLoading, isError } = useSermons();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<AnswerMode>("ai");
  const bottomRef = useRef<HTMLDivElement>(null);

  const lastAssistant = useMemo(
    () =>
      [...turns].reverse().find((turn): turn is AssistantTurn => turn.role === "assistant"),
    [turns],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "end",
    });
  }, [turns]);

  const submit = async (raw: string) => {
    const question = raw.trim();
    if (!question || busy || !sermons.length) return;

    setInput("");

    // The previous answer supplies conversational context: what we just offered
    // notes for, and any Sundays we asked the visitor to choose between.
    const context = {
      pendingSermon: lastAssistant?.result.offerNotes ? lastAssistant.result.sermon : undefined,
      candidates: lastAssistant?.result.candidates,
    };

    const result = resolveQuery(question, sermons, context, {
      ai: mode === "archive" ? "off" : "auto",
    });
    const userId = nextId();
    const assistantId = nextId();

    setTurns((prev) => [
      ...prev,
      { id: userId, role: "user", text: question },
      { id: assistantId, role: "assistant", result, aiPending: !!result.escalate },
    ]);

    if (!result.escalate) return;

    setBusy(true);
    const grounding = result.relevant ?? (result.sermon ? [result.sermon] : []);
    const answer = await askAi(question, grounding);
    setTurns((prev) =>
      prev.map((turn) =>
        turn.id === assistantId && turn.role === "assistant"
          ? {
              ...turn,
              aiPending: false,
              aiText: answer ?? undefined,
              aiUnavailable: answer === null,
            }
          : turn,
      ),
    );
    setBusy(false);
  };

  const openNotes = (turnId: string, sermon: Sermon) => {
    setTurns((prev) =>
      prev.map((turn) =>
        turn.id === turnId && turn.role === "assistant"
          ? {
              ...turn,
              notesOpen: true,
              result: { ...turn.result, intent: "notes", sermon, offerNotes: false },
            }
          : turn,
      ),
    );
  };

  /**
   * On-demand escalation, so any lookup can get a narrative even though the
   * automatic path leaves plain lookups to the archive.
   */
  const explainWithAi = async (turnId: string, sermon: Sermon) => {
    if (busy) return;
    setBusy(true);
    setTurns((prev) =>
      prev.map((turn) =>
        turn.id === turnId && turn.role === "assistant"
          ? { ...turn, aiPending: true, aiUnavailable: false, aiText: undefined }
          : turn,
      ),
    );
    const answer = await askAi(
      `Summarise what the sermon notes for ${sermonTitle(sermon)} teach, and what they mean for us.`,
      [sermon],
    );
    setTurns((prev) =>
      prev.map((turn) =>
        turn.id === turnId && turn.role === "assistant"
          ? {
              ...turn,
              aiPending: false,
              aiText: answer ?? undefined,
              aiUnavailable: answer === null,
            }
          : turn,
      ),
    );
    setBusy(false);
  };

  const renderAssistant = (turn: AssistantTurn) => {
    const { result } = turn;

    if (result.candidates?.length) {
      return (
        <AssistantText>
          <p className="mb-2">
            {result.candidates.length} Sundays match. Which one did you mean?
          </p>
          <div className="flex flex-wrap gap-2">
            {result.candidates.map((sermon) => (
              <button
                key={sermon.id}
                type="button"
                onClick={() => submit(sermonTitle(sermon))}
                disabled={busy}
                className={cn(
                  "rounded-full border border-border px-3.5 py-1 text-xs font-semibold font-body",
                  "text-foreground/80 transition-colors hover:border-gold/60 hover:bg-gold/5 hover:text-navy",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
                  "disabled:opacity-50 disabled:pointer-events-none",
                )}
              >
                {sermonTitle(sermon)}
                <span className="text-muted-foreground font-normal"> &middot; {sermon.date}</span>
              </button>
            ))}
          </div>
        </AssistantText>
      );
    }

    if (result.intent === "help") {
      return (
        <AssistantText>
          <p className="mb-2">
            I answer from the parish sermon archive: the Bible readings, who preached, and the
            theme for any Sunday — and I can show you the notes. Try one of these:
          </p>
          <SuggestionChips onPick={submit} busy={busy} />
        </AssistantText>
      );
    }

    if (result.intent === "decline") {
      return <AssistantText>No problem. Ask me about any other Sunday.</AssistantText>;
    }

    if (result.needsTarget) {
      return (
        <AssistantText>
          <p className="mb-2">
            Which Sunday? Give me a date like <span className="font-semibold">19 July 2026</span>,
            or a Sunday name like{" "}
            <span className="font-semibold">4th Sunday After Trinity</span>.
          </p>
          <SuggestionChips onPick={submit} busy={busy} />
        </AssistantText>
      );
    }

    if (result.list?.length) {
      const shown = result.list.slice(0, MAX_LIST);
      return (
        <div className="space-y-2">
          <AssistantText>
            {result.preacher
              ? `${result.preacher} appears in ${result.list.length} recorded ${
                  result.list.length === 1 ? "Sunday" : "Sundays"
                }.`
              : `${result.list.length} Sundays found.`}
          </AssistantText>
          <div className="flex flex-wrap gap-2">
            {shown.map((sermon) => (
              <button
                key={sermon.id}
                type="button"
                onClick={() => submit(sermonTitle(sermon))}
                disabled={busy}
                className={cn(
                  "rounded-full border border-border px-3.5 py-1 text-xs font-semibold font-body",
                  "text-foreground/80 transition-colors hover:border-gold/60 hover:bg-gold/5 hover:text-navy",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
                  "disabled:opacity-50 disabled:pointer-events-none",
                )}
              >
                {sermonTitle(sermon)}
                <span className="text-muted-foreground font-normal"> &middot; {sermon.date}</span>
              </button>
            ))}
          </div>
          {result.list.length > shown.length && (
            <Link
              to="/sermons"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-gold transition-colors font-body"
            >
              Browse all {result.list.length} in the archive
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      );
    }

    if (result.sermon) {
      return (
        <div className="space-y-3">
          <SermonCard
            sermon={result.sermon}
            service={result.service}
            intent={result.intent}
            notesOpen={turn.notesOpen || result.intent === "notes"}
            busy={busy}
            onOpenNotes={() => openNotes(turn.id, result.sermon!)}
            onDecline={() => submit("no thanks")}
          />
          {mode === "ai" && !turn.aiText && !turn.aiPending && (
            <button
              type="button"
              onClick={() => explainWithAi(turn.id, result.sermon!)}
              disabled={busy}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1 text-xs font-semibold font-body",
                "text-foreground/80 transition-colors hover:border-gold/60 hover:bg-gold/5 hover:text-navy",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
                "disabled:opacity-50 disabled:pointer-events-none",
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Explain with AI
            </button>
          )}
          {turn.aiPending && (
            <p className="flex items-center gap-2 text-sm font-body text-muted-foreground">
              <Loader2 className="w-4 h-4 text-gold animate-spin motion-reduce:animate-none" />
              Reading the notes…
            </p>
          )}
          {turn.aiText && (
            <div className="rounded-xl border border-border bg-cream p-4">
              <p className="text-xs uppercase tracking-wide text-gold font-body mb-1.5">
                From the notes
              </p>
              <p className="font-body text-sm text-foreground/90 whitespace-pre-line">
                {turn.aiText}
              </p>
            </div>
          )}
          {turn.aiUnavailable && (
            <p className="text-xs italic font-body text-muted-foreground">
              The reading assistant isn't available right now, but the answer above comes straight
              from the archive.
            </p>
          )}
        </div>
      );
    }

    // Nothing matched, and the LLM may still be able to help.
    return (
      <div className="space-y-3">
        {turn.aiPending && (
          <p className="flex items-center gap-2 text-sm font-body text-muted-foreground">
            <Loader2 className="w-4 h-4 text-gold animate-spin motion-reduce:animate-none" />
            Looking through the archive…
          </p>
        )}
        {turn.aiText && (
          <div className="rounded-xl border border-border bg-cream p-4">
            <p className="text-xs uppercase tracking-wide text-gold font-body mb-1.5">
              From the notes
            </p>
            <p className="font-body text-sm text-foreground/90 whitespace-pre-line">
              {turn.aiText}
            </p>
          </div>
        )}
        {(turn.aiUnavailable || !turn.aiPending) && !turn.aiText && (
          <AssistantText>
            <p className="mb-2">
              {mode === "archive"
                ? "Archive-only mode answers about a named Sunday, and I couldn't match one. Switch to Archive + AI for open-ended questions, or name a Sunday:"
                : "I answer from the parish sermon archive, and I couldn't match that to a Sunday. Try naming one:"}
            </p>
            <SuggestionChips onPick={submit} busy={busy} />
          </AssistantText>
        )}
      </div>
    );
  };

  const disabled = busy || isLoading || isError || !sermons.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopInfoBar />
      <MainNavbar />

      <section className="bg-navy py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold tracking-wider uppercase font-body mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Sermon Archive
          </div>
          <h1 className="font-display text-3xl md:text-5xl text-cream mb-4">Ask the Archive</h1>
          <p className="text-cream/80 font-body max-w-2xl mx-auto">
            Ask about any Sunday and I'll tell you the readings, who preached, and the theme — then
            offer you the sermon notes.
          </p>
        </div>
      </section>

      <section className="flex-1 py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          {isLoading && (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold motion-reduce:animate-none" />
              <p className="text-muted-foreground font-body mt-4">Loading the archive…</p>
            </div>
          )}

          {isError && (
            <div className="text-center py-16">
              <p className="text-destructive font-body">
                The sermon archive couldn't be loaded just now. Please try again.
              </p>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground font-body">
                  {mode === "ai"
                    ? "Open-ended questions are answered by AI from the notes; lookups stay instant."
                    : "Answers come only from the sermon archive. No AI is used."}
                </p>
                <ModeToggle mode={mode} onChange={setMode} disabled={busy} />
              </div>

              <ScrollArea className="h-[55vh] min-h-[340px] rounded-xl border border-border bg-background p-4">
                <div
                  role="log"
                  aria-live="polite"
                  aria-relevant="additions"
                  className="space-y-4 pr-1"
                >
                  {turns.length === 0 && (
                    <div className="text-center py-8">
                      <Sparkles className="w-8 h-8 text-gold mx-auto mb-3" />
                      <h2 className="font-display text-xl text-navy mb-1">Ask about any Sunday</h2>
                      <p className="text-sm text-muted-foreground font-body max-w-md mx-auto mb-5">
                        I answer from the parish sermon archive — the readings, who preached, and
                        the theme. Then I can show you the notes.
                      </p>
                      <div className="flex justify-center">
                        <SuggestionChips onPick={submit} busy={busy} />
                      </div>
                    </div>
                  )}

                  {turns.map((turn) =>
                    turn.role === "user" ? (
                      <div
                        key={turn.id}
                        className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-navy px-4 py-2 font-body text-sm text-cream"
                      >
                        {turn.text}
                      </div>
                    ) : (
                      <div key={turn.id}>{renderAssistant(turn)}</div>
                    ),
                  )}
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>

              <form
                className="mt-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  submit(input);
                }}
              >
                <label htmlFor="ask-input" className="sr-only">
                  Your question about a Sunday
                </label>
                <div className="flex items-end gap-2">
                  <Textarea
                    id="ask-input"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        submit(input);
                      }
                    }}
                    rows={1}
                    disabled={disabled}
                    placeholder="e.g. readings for 7th Sunday after Trinity"
                    className="resize-none min-h-[44px] max-h-32"
                  />
                  <Button
                    type="submit"
                    variant="gold"
                    size="icon"
                    aria-label="Send question"
                    disabled={disabled || !input.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground font-body">
                  Answers come from the parish sermon archive. Press Enter to send, Shift+Enter for
                  a new line.
                </p>
              </form>
            </>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default AskSermons;
