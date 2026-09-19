import { useState, useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import TopInfoBar from "@/components/TopInfoBar";
import MainNavbar from "@/components/MainNavbar";
import {
  fetchAllSermons,
  getAvailableMonths,
  getAvailableYears,
  getSermonsByMonth,
  getSermonsByYear,
  toSermonDate,
  Sermon,
} from "@/lib/sermonLoader";
import { Calendar, User, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const monthLabel = (month: number, style: "short" | "long") =>
  new Date(2020, month, 1).toLocaleDateString("en-GB", { month: style });

interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

const FilterPill = ({ active, onClick, children }: FilterPillProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "inline-flex items-center rounded-full border px-3.5 py-1 text-xs sm:text-sm font-semibold font-body transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      active
        ? "border-navy bg-navy text-cream shadow-sm"
        : "border-border bg-transparent text-foreground/80 hover:border-gold/60 hover:bg-gold/5 hover:text-navy",
    )}
  >
    {children}
  </button>
);

const SermonNotes = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<number | "all">("all");

  useEffect(() => {
    const loadSermons = async () => {
      try {
        const data = await fetchAllSermons();
        setSermons(data);
      } catch (err) {
        setError("Failed to load sermons");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSermons();
  }, []);

  const availableYears = getAvailableYears(sermons);
  // The year narrows first, so the month rail only offers months that year holds.
  const sermonsInYear =
    selectedYear === "all" ? sermons : getSermonsByYear(sermons, parseInt(selectedYear));
  const availableMonths = getAvailableMonths(sermonsInYear);
  const filteredSermons =
    selectedMonth === "all" ? sermonsInYear : getSermonsByMonth(sermonsInYear, selectedMonth);

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    setSelectedMonth("all");
  };

  const activeFilter = [
    selectedMonth === "all" ? null : monthLabel(selectedMonth, "long"),
    selectedYear === "all" ? null : selectedYear,
  ]
    .filter(Boolean)
    .join(" ");

  const formatDate = (dateString: string) => {
    return toSermonDate(dateString).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopInfoBar />
      <MainNavbar />

      {/* Hero Section */}
      <section className="bg-navy py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-5xl text-cream mb-4">
            Sermon Notes
          </h1>
          <p className="text-cream/80 font-body max-w-2xl mx-auto">
            Access sermon notes from our weekly English and Kikuyu services.
            Grow in faith as you reflect on God's Word.
          </p>
        </div>
      </section>

      {/* Filter Rail */}
      {!loading && !error && sermons.length > 0 && (
        <section className="py-6 border-b border-border bg-background">
          <div className="container mx-auto px-4 space-y-4">
            {/* Summary + coarse (year) filter */}
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <p className="text-muted-foreground font-body text-sm sm:text-base">
                Showing {filteredSermons.length} sermon
                {filteredSermons.length !== 1 ? "s" : ""}
                {activeFilter && (
                  <span className="text-foreground font-semibold"> &middot; {activeFilter}</span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <span
                  id="year-filter-label"
                  className="text-[11px] font-semibold uppercase tracking-wider text-gold font-body"
                >
                  Year
                </span>
                <Select value={selectedYear} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-32" aria-labelledby="year-filter-label">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Month rail — chronological, only months the archive actually holds */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span
                id="month-filter-label"
                className="text-[11px] font-semibold uppercase tracking-wider text-gold font-body"
              >
                Month
              </span>
              <div
                role="group"
                aria-labelledby="month-filter-label"
                className="flex flex-wrap items-center gap-2"
              >
                <FilterPill
                  active={selectedMonth === "all"}
                  onClick={() => setSelectedMonth("all")}
                >
                  All
                </FilterPill>
                {availableMonths.map((month) => (
                  <FilterPill
                    key={month}
                    active={selectedMonth === month}
                    onClick={() => setSelectedMonth(month)}
                  >
                    {monthLabel(month, "short")}
                  </FilterPill>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {loading && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold" />
            <p className="text-muted-foreground font-body mt-4">Loading sermons...</p>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-destructive font-body">{error}</p>
          </div>
        </section>
      )}

      {/* Sermon Cards Grid */}
      {!loading && !error && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSermons.map((sermon) => (
                <div
                  key={sermon.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                >
                  {/* Card Header */}
                  <div className="bg-navy/5 p-4 border-b border-border">
                    <div className="flex items-center gap-2 text-gold mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium font-body">
                        {formatDate(sermon.date)}
                      </span>
                    </div>
                    <h3 className="font-display text-lg text-foreground">
                      {sermon.sundayName}
                    </h3>
                    {sermon.theme && (
                      <p className="text-muted-foreground text-sm font-body mt-1">
                        Theme: {sermon.theme}
                      </p>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-4">
                    {/* English Service */}
                    <div>
                      <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-body">
                        English Service
                      </h4>
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <User className="w-3 h-3 text-gold" />
                        <span className="font-body">
                          {sermon.englishService.preacher}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <BookOpen className="w-3 h-3 mt-0.5 text-gold" />
                        <span className="font-body">
                          {sermon.englishService.bibleVerses.join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Kikuyu Service */}
                    <div>
                      <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-body">
                        Kikuyu Service
                      </h4>
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <User className="w-3 h-3 text-gold" />
                        <span className="font-body">
                          {sermon.kikuyuService.preacher}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <BookOpen className="w-3 h-3 mt-0.5 text-gold" />
                        <span className="font-body">
                          {sermon.kikuyuService.bibleVerses.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 pt-0">
                    <Link to={`/sermons/${sermon.id}`}>
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-gold group-hover:text-navy group-hover:border-gold transition-colors"
                      >
                        View Notes
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredSermons.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground font-body">
                  {sermons.length === 0
                    ? "No sermon notes have been published yet."
                    : "No sermon notes match this filter."}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default SermonNotes;
