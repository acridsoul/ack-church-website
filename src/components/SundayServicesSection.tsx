import { Clock, Users, BookOpen, MapPin, Sparkles, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  time: string;
  badge: string;
  language: string;
  description: string;
  highlights: string[];
  icon: typeof Clock;
}

const services: ServiceCardProps[] = [
  {
    title: "Express Service",
    time: "7:00 AM – 8:15 AM",
    badge: "Early Morning",
    language: "English & Liturgy",
    description: "A focused, meditative morning service designed for quiet reflection, prayer, and celebration of Holy Communion.",
    highlights: ["Holy Communion", "Reflective Worship", "Early Start"],
    icon: Clock,
  },
  {
    title: "English Service",
    time: "8:30 AM – 10:15 AM",
    badge: "Family & Youth",
    language: "English",
    description: "Our main family service featuring contemporary and traditional praise, choral worship, Sunday school, and dynamic sermon.",
    highlights: ["Sunday School Ministry", "Choir Worship", "Family-Focused"],
    icon: Users,
  },
  {
    title: "Kikuyu Service",
    time: "10:30 AM – 12:30 PM",
    badge: "Gĩkũyũ Liturgy",
    language: "Gĩkũyũ",
    description: "A vibrant service celebrating our heritage through traditional Anglican liturgy, hymns, prayer, and deep biblical preaching in Gĩkũyũ.",
    highlights: ["Traditional Hymns", "Gĩkũyũ Preaching", "Fellowship Hour"],
    icon: HeartHandshake,
  },
];

const SundayServicesSection = () => {
  return (
    <section id="services" className="py-16 md:py-24 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 text-gold text-xs md:text-sm font-semibold tracking-wide uppercase font-body mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            Worship With Us
          </div>
          <h2 className="font-display text-3xl md:text-5xl text-navy mb-4 font-bold">
            Sunday Service <span className="text-gold italic">Schedule</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg font-body leading-relaxed">
            Every Sunday at A.C.K. St. Stephen's Church Gatuanyaga, we gather across three distinct services.
            Whether you prefer early morning quiet, family worship in English, or our traditional Gĩkũyũ liturgy, you are warmly welcome.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-card border-2 border-border/80 rounded-xl overflow-hidden shadow-card hover:shadow-xl hover:border-gold/60 transition-all duration-300 flex flex-col group"
              >
                {/* Card Header Top */}
                <div className="bg-navy p-6 text-primary-foreground relative">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider bg-gold/20 text-gold px-2.5 py-1 rounded-full font-body">
                      {service.badge}
                    </span>
                    <span className="text-xs text-primary-foreground/75 font-body">
                      {service.language}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-primary-foreground group-hover:text-gold transition-colors">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-gold font-body font-semibold text-lg">
                    <Icon className="w-5 h-5" />
                    <span>{service.time}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-2 border-t border-border pt-4">
                    <p className="text-xs font-semibold text-navy uppercase tracking-wider font-body">
                      Service Highlights
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="bg-muted/70 text-foreground text-xs px-2.5 py-1 rounded-md font-body"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visitor Guidance Banner */}
        <div className="bg-cream border border-gold/40 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/20 text-gold flex items-center justify-center flex-shrink-0 mt-1">
              <MapPin className="w-6 h-6 text-navy" />
            </div>
            <div>
              <h4 className="font-display text-xl font-bold text-navy mb-1">
                Visiting for the First Time?
              </h4>
              <p className="text-muted-foreground text-sm md:text-base font-body">
                We are located in <strong>Gatuanyaga, Thika</strong> (A.C.K. Diocese of Thika).
                Our hospitality stewards are stationed at the entrance to welcome you and assist with seating.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
            <Link to="/sermons" className="w-full md:w-auto">
              <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-primary-foreground w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Read Past Sermons
              </Button>
            </Link>
            <a
              href="mailto:ackststephenschurch@gmail.com"
              className="w-full md:w-auto"
            >
              <Button variant="gold" className="w-full">
                Contact Office
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SundayServicesSection;
