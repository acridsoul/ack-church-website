import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fetchAllSermons, toSermonDate, Sermon } from "@/lib/sermonLoader";
import { BookOpen, Calendar, User, ArrowRight, Sparkles, Download, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

const LatestSermonSpotlight = () => {
  const [latestSermon, setLatestSermon] = useState<Sermon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllSermons()
      .then((sermons) => {
        if (sermons.length > 0) {
          setLatestSermon(sermons[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to load latest sermon", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section id="latest-sermon" className="py-16 md:py-24 bg-navy text-primary-foreground relative overflow-hidden">
      {/* Background ambient gold lights */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-10 left-10 w-80 h-80 bg-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/20 text-gold text-xs md:text-sm font-semibold tracking-wide uppercase font-body mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            Nourishment in the Word
          </div>
          <h2 className="font-display text-3xl md:text-5xl text-primary-foreground mb-4 font-bold">
            Latest Sermon <span className="text-gold italic">Spotlight</span>
          </h2>
          <p className="text-primary-foreground/80 text-base md:text-lg font-body leading-relaxed">
            Missed a Sunday or want to meditate deeper on God's Word? Review the latest sermon readings, notes, and outlines from our weekly English and Kikuyu services.
          </p>
        </div>

        {/* Featured Sermon Showcase Card */}
        {latestSermon ? (
          <div className="max-w-4xl mx-auto bg-navy-dark/90 border-2 border-gold/50 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-primary-foreground/15 pb-4">
              <div className="flex items-center gap-2 text-gold font-body text-sm md:text-base font-semibold">
                <Calendar className="w-4 h-4" />
                <span>{format(toSermonDate(latestSermon.date), "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-gold/20 text-gold text-xs px-3 py-1 rounded-full font-body font-medium">
                <Languages className="w-3.5 h-3.5" />
                English &amp; Gĩkũyũ Notes Available
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <span className="text-xs uppercase tracking-widest text-gold font-semibold font-body">
                  {latestSermon.sundayName}
                </span>

                <h3 className="font-display text-2xl md:text-4xl text-primary-foreground font-bold leading-tight">
                  {latestSermon.theme ? latestSermon.theme : "Sunday Service Notes"}
                </h3>

                {/* Preacher and Bible Readings */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2.5 text-sm md:text-base font-body text-primary-foreground/90">
                    <User className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>
                      Preacher: <strong className="text-primary-foreground">{latestSermon.englishService.preacher}</strong>
                    </span>
                  </div>

                  {latestSermon.englishService.bibleVerses.length > 0 && (
                    <div className="flex items-start gap-2.5 text-sm md:text-base font-body">
                      <BookOpen className="w-4 h-4 text-gold flex-shrink-0 mt-1" />
                      <div className="flex flex-wrap gap-2">
                        {latestSermon.englishService.bibleVerses.map((verse, idx) => (
                          <span
                            key={idx}
                            className="bg-navy border border-gold/40 text-gold text-xs md:text-sm px-3 py-1 rounded-full font-body"
                          >
                            {verse}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Column */}
              <div className="md:col-span-4 flex flex-col gap-3 justify-center md:border-l md:border-primary-foreground/15 md:pl-8">
                <Link to={`/sermons/${latestSermon.id}`} className="w-full">
                  <Button variant="gold" size="lg" className="w-full gap-2">
                    Read Full Notes
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                {latestSermon.englishService.pdfUrl && (
                  <Button asChild variant="goldOutline" size="default" className="w-full">
                    <a href={latestSermon.englishService.pdfUrl} target="_blank" rel="noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </a>
                  </Button>
                )}

                <Link to="/sermons" className="w-full text-center">
                  <Button variant="ghost" className="text-primary-foreground/80 hover:text-gold w-full text-sm font-body">
                    Browse All Past Sermons &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="max-w-4xl mx-auto bg-navy-dark/60 border border-border/20 rounded-2xl p-12 text-center">
            <p className="text-primary-foreground/70 font-body">Loading latest sermon...</p>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default LatestSermonSpotlight;
