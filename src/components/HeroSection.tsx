import { ChevronDown } from "lucide-react";
import membersSeekers from "@/assets/members-seekers.jpg";
import churchLeaders from "@/assets/church-leaders.jpg";
import councilLeaders from "@/assets/council-leaders.jpg";

interface CategoryCircleProps {
  image: string;
  label: string;
  delay?: string;
}

const CategoryCircle = ({ image, label, delay = "0s" }: CategoryCircleProps) => (
  <a
    href="#"
    className="group flex flex-col items-center gap-3 opacity-0 animate-scale-in"
    style={{ animationDelay: delay }}
  >
    <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-gold/30 group-hover:border-gold transition-all duration-300 group-hover:scale-105 shadow-lg">
      <img
        src={image}
        alt={label}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-navy/40 group-hover:bg-navy/20 transition-colors duration-300" />
      <div className="absolute inset-0 flex items-center justify-center p-2">
        <span className="text-primary-foreground font-semibold text-center text-xs md:text-sm leading-tight uppercase tracking-wide font-body">
          {label}
        </span>
      </div>
    </div>
  </a>
);

const HeroSection = () => {
  return (
    <section className="relative bg-navy min-h-[85vh] flex items-center overflow-hidden">
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
        <div className="absolute bottom-4 right-4 left-4 lg:left-auto bg-navy/80 text-primary-foreground text-xs p-3 max-w-md rounded-sm opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <p>
            Community Place Kitchen volunteers unload groceries for the week's community meal. 
            Our church is located in an affordable housing complex.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-20">
        <div className="max-w-2xl">
          {/* Main Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 opacity-0 animate-fade-in">
            <span className="italic text-gold">FOR US</span>{" "}
            <span className="italic text-primary-foreground">AND FOR</span>
            <br />
            <span className="italic text-primary-foreground">OUR SALVATION</span>
          </h1>

          {/* Welcome Text */}
          <h2 className="font-display text-xl md:text-2xl text-primary-foreground mb-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Welcome to ACK St. Stephen's Church Gatuanyaga!
          </h2>

          <p className="text-primary-foreground/80 text-base md:text-lg mb-4 font-body opacity-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            Find ideas, inspiration, and resources for welcoming God's Word made flesh among us.
          </p>

          <div className="bg-gold/20 border-l-4 border-gold p-4 rounded-r-md mb-10 opacity-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <p className="text-gold font-semibold text-sm uppercase tracking-wide mb-2 font-body">Theme of the Year</p>
            <p className="text-primary-foreground italic text-sm md:text-base font-body">
              "And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others."
            </p>
            <p className="text-primary-foreground/70 text-sm mt-2 font-body">— 2 Timothy 2:2</p>
          </div>

          {/* Category Circles */}
          <div className="flex flex-wrap gap-6 md:gap-8 mb-10">
            <CategoryCircle
              image={membersSeekers}
              label="Members & Seekers"
              delay="0.5s"
            />
            <a href="#church-leaders">
              <CategoryCircle
                image={churchLeaders}
                label="Church Leaders"
                delay="0.6s"
              />
            </a>
            <CategoryCircle
              image={councilLeaders}
              label="Council Leaders"
              delay="0.7s"
            />
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center lg:justify-start opacity-0 animate-fade-in" style={{ animationDelay: "0.9s" }}>
            <a
              href="#content"
              className="flex flex-col items-center text-primary-foreground/60 hover:text-gold transition-colors duration-300 group"
              aria-label="Scroll down"
            >
              <span className="text-sm mb-2 font-body">Explore More</span>
              <ChevronDown className="h-6 w-6 animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
