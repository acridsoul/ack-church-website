import { useParams, Link } from "react-router-dom";
import TopInfoBar from "@/components/TopInfoBar";
import MainNavbar from "@/components/MainNavbar";
import { getSermonById } from "@/data/sermons";
import { Calendar, User, BookOpen, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const SermonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const sermon = id ? getSermonById(id) : undefined;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering for headers, bold, lists, and blockquotes
    return content.split("\n").map((line, index) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="font-display text-lg text-foreground mt-6 mb-2"
          >
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="font-display text-xl text-foreground mt-4 mb-3"
          >
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
      // List items
      if (line.startsWith("- ")) {
        const content = line.replace("- ", "");
        // Handle bold text
        const parts = content.split(/(\*\*.*?\*\*)/);
        return (
          <li key={index} className="ml-4 font-body text-foreground/90">
            {parts.map((part, i) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={i}>{part.slice(2, -2)}</strong>
              ) : (
                part
              )
            )}
          </li>
        );
      }
      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        const content = line.replace(/^\d+\.\s/, "");
        const parts = content.split(/(\*\*.*?\*\*)/);
        return (
          <li
            key={index}
            className="ml-4 list-decimal font-body text-foreground/90 mb-2"
          >
            {parts.map((part, i) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={i}>{part.slice(2, -2)}</strong>
              ) : (
                part
              )
            )}
          </li>
        );
      }
      // Empty lines
      if (line.trim() === "") {
        return <div key={index} className="h-2" />;
      }
      // Regular paragraphs
      return (
        <p key={index} className="font-body text-foreground/90 mb-2">
          {line}
        </p>
      );
    });
  };

  if (!sermon) {
    return (
      <div className="min-h-screen bg-background">
        <TopInfoBar />
        <MainNavbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">
            Sermon Not Found
          </h1>
          <p className="text-muted-foreground mb-6 font-body">
            The sermon you're looking for doesn't exist.
          </p>
          <Link to="/sermons">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sermon Notes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopInfoBar />
      <MainNavbar />

      {/* Hero Section */}
      <section className="bg-navy py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Link
            to="/sermons"
            className="inline-flex items-center text-cream/70 hover:text-cream mb-4 font-body transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sermon Notes
          </Link>

          <div className="flex items-center gap-2 text-gold mb-3">
            <Calendar className="w-5 h-5" />
            <span className="font-medium font-body">
              {formatDate(sermon.date)}
            </span>
          </div>

          <h1 className="font-display text-2xl md:text-4xl text-cream mb-2">
            {sermon.sundayName}
          </h1>

          {sermon.theme && (
            <p className="text-cream/80 font-body text-lg">
              Theme: {sermon.theme}
            </p>
          )}
        </div>
      </section>

      {/* Sermon Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* English Service */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="bg-navy/5 p-4 border-b border-border">
                <h2 className="font-display text-xl text-foreground">
                  English Service
                </h2>
              </div>

              <div className="p-6">
                {/* Preacher */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-body">
                      Preacher
                    </p>
                    <p className="font-body font-medium text-foreground">
                      {sermon.englishService.preacher}
                    </p>
                  </div>
                </div>

                {/* Bible Verses */}
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-body">
                      Bible Reading
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {sermon.englishService.bibleVerses.map((verse, index) => (
                        <span
                          key={index}
                          className="bg-gold/10 text-gold px-2 py-1 rounded text-sm font-body"
                        >
                          {verse}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-xs text-muted-foreground uppercase tracking-wide font-body mb-4">
                    Sermon Notes
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    {renderMarkdown(sermon.englishService.notes)}
                  </div>
                </div>

                {/* Download PDF */}
                {sermon.englishService.pdfUrl && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Kikuyu Service */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="bg-navy/5 p-4 border-b border-border">
                <h2 className="font-display text-xl text-foreground">
                  Kikuyu Service
                </h2>
              </div>

              <div className="p-6">
                {/* Preacher */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-body">
                      Mũrutani
                    </p>
                    <p className="font-body font-medium text-foreground">
                      {sermon.kikuyuService.preacher}
                    </p>
                  </div>
                </div>

                {/* Bible Verses */}
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-body">
                      Gũthoma Ibuku
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {sermon.kikuyuService.bibleVerses.map((verse, index) => (
                        <span
                          key={index}
                          className="bg-gold/10 text-gold px-2 py-1 rounded text-sm font-body"
                        >
                          {verse}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-xs text-muted-foreground uppercase tracking-wide font-body mb-4">
                    Maandĩko ma Ũhoro
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    {renderMarkdown(sermon.kikuyuService.notes)}
                  </div>
                </div>

                {/* Download PDF */}
                {sermon.kikuyuService.pdfUrl && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SermonDetail;
