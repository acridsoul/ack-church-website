import type { ReactNode } from "react";

/**
 * The small markdown subset the sermon archive is authored in: `##` / `###`
 * headings, `>` blockquotes, `-` and `1.` lists, `**bold**`, and blank lines as
 * spacers.
 *
 * Extracted from SermonDetail so the /ask chatbot renders notes exactly the same
 * way instead of carrying a second, drifting copy.
 */
const renderSermonNotes = (content: string): ReactNode[] =>
  content.split("\n").map((line, index) => {
    // Headings
    if (line.startsWith("### ")) {
      return (
        <h3 key={index} className="font-display text-lg text-foreground mt-6 mb-2">
          {line.replace("### ", "")}
        </h3>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h2 key={index} className="font-display text-xl text-foreground mt-4 mb-3">
          {line.replace("## ", "")}
        </h2>
      );
    }
    // Blockquotes
    if (line.startsWith("> ")) {
      return (
        <blockquote
          key={index}
          className="border-l-4 border-gold pl-4 italic text-muted-foreground my-4 font-body"
        >
          {line.replace("> ", "")}
        </blockquote>
      );
    }
    // Unordered list items
    if (line.startsWith("- ")) {
      const text = line.replace("- ", "");
      const parts = text.split(/(\*\*.*?\*\*)/);
      return (
        <li key={index} className="ml-4 font-body text-foreground/90">
          {parts.map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={i}>{part.slice(2, -2)}</strong>
            ) : (
              part
            ),
          )}
        </li>
      );
    }
    // Numbered list items
    if (/^\d+\.\s/.test(line)) {
      const text = line.replace(/^\d+\.\s/, "");
      const parts = text.split(/(\*\*.*?\*\*)/);
      return (
        <li key={index} className="ml-4 list-decimal font-body text-foreground/90 mb-2">
          {parts.map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={i}>{part.slice(2, -2)}</strong>
            ) : (
              part
            ),
          )}
        </li>
      );
    }
    // Blank lines become spacers
    if (line.trim() === "") {
      return <div key={index} className="h-2" />;
    }
    // Anything else is a paragraph
    const parts = line.split(/(\*\*.*?\*\*)/);
    return (
      <p key={index} className="font-body text-foreground/90 mb-2">
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i}>{part.slice(2, -2)}</strong>
          ) : (
            part
          ),
        )}
      </p>
    );
  });

interface SermonNotesBodyProps {
  content: string;
  className?: string;
}

const SermonNotesBody = ({
  content,
  className = "prose prose-sm max-w-none",
}: SermonNotesBodyProps) => <div className={className}>{renderSermonNotes(content)}</div>;

export default SermonNotesBody;
