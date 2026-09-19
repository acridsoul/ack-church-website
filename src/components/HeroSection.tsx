import { ChevronDown, Clock, BookOpen, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import membersSeekers from "@/assets/members-seekers.jpg";
import churchLeaders from "@/assets/church-leaders.jpg";

interface CategoryCircleProps {
  image: string;
  label: string;
  delay?: string;
  href?: string;
}

const CategoryCircle = ({ image, label, delay = "0s", href = "#" }: CategoryCircleProps) => (
  <Link
    to={href}
    className="group flex flex-col items-center gap-2.5 opacity-0 animate-scale-in"
    style={{ animationDelay: delay }}
  >
    <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gold/40 group-hover:border-gold transition-all duration-300 group-hover:scale-105 shadow-xl">
      <img
        src={image}
        alt={label}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-navy/40 group-hover:bg-navy/20 transition-colors duration-300" />
      <div className="absolute inset-0 flex items-center justify-center p-2">
        <span className="text-primary-foreground font-bold text-center text-xs md:text-sm leading-tight uppercase tracking-wider font-body drop-shadow-md">
          {label}
        </span>
      </div>
    </div>
  </Link>
);

const HeroSection = () => {
  return (
    <section className="relative bg-navy min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-transparent z-10" />

      {/* Hero Image on right */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2">
        <img
          src="/images/church1.png"
          alt="ACK St. Stephens Church Gatuanyaga aerial view"
          className="w-full h-full object-cover opacity-0 animate-slide-in-right"
          style={{ animationDelay: "0.3s", objectPosition: "left center" }}
        />
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-20">
        <div className="max-w-2xl">
          {/* Proclamation Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold tracking-wider uppercase font-body mb-4 opacity-0 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            A.C.K. Diocese of Thika
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.1] md:leading-tight mb-4 opacity-0 animate-fade-in">
            <span className="italic text-gold">FOR US</span>{" "}
            <span className="italic text-primary-foreground">AND FOR</span>
            <br />
            <span className="italic text-primary-foreground">OUR SALVATION</span>
          </h1>

          {/* Welcome Text */}
          <h2 className="font-display text-lg md:text-2xl text-primary-foreground mb-3 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Welcome to ACK St. Stephen's Church Gatuanyaga!
          </h2>

          <p className="text-primary-foreground/85 text-sm md:text-lg mb-6 font-body leading-relaxed opacity-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            United in Christ, serving our community with love and compassion. Join us every Sunday for English and Kikuyu worship services.
          </p>

          {/* Action CTAs for Visitors */}
          <div className="flex flex-wrap items-center gap-4 mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.35s" }}>
            <a href="#services">
              <Button variant="gold" size="lg" className="gap-2 shadow-lg hover-gold-glow">
                <Clock className="w-4 h-4" />
                Sunday Service Times
              </Button>
            </a>
            <a href="#latest-sermon">
              <Button variant="goldOutline" size="lg" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Latest Sermon Notes
              </Button>
            </a>
          </div>

          {/* Theme of the Year Card */}
          <div className="bg-gold/15 border-l-4 border-gold p-4 rounded-r-md mb-8 backdrop-blur-sm opacity-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <p className="text-gold font-semibold text-xs uppercase tracking-wider mb-1.5 font-body">Theme of the Year</p>
            <p className="text-primary-foreground italic text-xs md:text-base font-body leading-relaxed">
              "And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others."
            </p>
            <p className="text-primary-foreground/75 text-xs md:text-sm mt-1.5 font-body font-medium">— 2 Timothy 2:2</p>
          </div>

          {/* Quick Hub Portals */}
          <div className="flex items-center gap-6 mb-8">
            <CategoryCircle
              image={membersSeekers}
              label="Ministries"
              delay="0.5s"
              href="/ministries"
            />
            <CategoryCircle
              image={churchLeaders}
              label="Church Leaders"
              delay="0.6s"
              href="/leadership"
            />
          </div>

          {/* Scroll indicator */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.9s" }}>
            <a
              href="#services"
              className="inline-flex items-center gap-2 text-gold/80 hover:text-gold transition-colors duration-300 group font-body text-xs md:text-sm font-semibold tracking-wider uppercase"
              aria-label="Scroll to services schedule"
            >
              <span>Explore Services &amp; Parish Life</span>
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
