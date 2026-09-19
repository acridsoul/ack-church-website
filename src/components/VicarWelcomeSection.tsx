import { Cross, Quote, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const VicarWelcomeSection = () => {
  return (
    <section className="py-16 md:py-24 bg-cream border-y border-border/60">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Vicar Portrait Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative pt-6 max-w-sm w-full">
              {/* Gold Cross Emblem Badge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-gold rounded-full p-2.5 shadow-glow">
                  <Cross className="h-5 w-5 text-navy-dark" />
                </div>
              </div>

              {/* Framed Card */}
              <div className="bg-card rounded-2xl overflow-hidden shadow-xl border-4 border-gold group">
                <div className="aspect-[4/5] overflow-hidden bg-navy">
                  <img
                    src="/images/leaders/vicar.jpg"
                    alt="Rev. Henry Kinyua, Vicar In Charge"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 text-center bg-card">
                  <h3 className="font-display text-2xl font-bold text-navy">
                    Rev. Henry Kinyua
                  </h3>
                  <p className="text-gold font-body font-semibold text-sm mt-0.5">
                    Vicar In Charge
                  </p>
                  <p className="text-muted-foreground text-xs font-body mt-1">
                    A.C.K. St. Stephen's Church Gatuanyaga
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/20 text-navy font-semibold text-xs md:text-sm tracking-wide uppercase font-body">
              <Heart className="w-3.5 h-3.5 text-gold" />
              Pastoral Welcome
            </div>

            <h2 className="font-display text-3xl md:text-5xl font-bold text-navy leading-tight">
              A Warm Welcome to Our <span className="text-gold italic">Parish Family</span>
            </h2>

            <div className="relative">
              <Quote className="w-10 h-10 text-gold/30 absolute -top-4 -left-2 -z-10" />
              <p className="text-foreground/90 font-body text-base md:text-lg leading-relaxed mb-4">
                <em>Karibu sana</em> to A.C.K. St. Stephen's Church Gatuanyaga. Whether you have just moved into our community, are seeking a spiritual home, or are visiting for the very first time, we receive you with the joy and love of Jesus Christ.
              </p>
              <p className="text-muted-foreground font-body text-base leading-relaxed">
                As an Anglican communion in the Diocese of Thika, we exist to exalt God in worship, nurture disciples of every generation, and serve one another in truth and compassion. In our parish, you will find sound biblical teaching, vibrant prayer cells across our neighborhoods, and faithful ministries tailored for men, women, youth, and children.
              </p>
            </div>

            {/* Parish Motto & Mission Pill */}
            <div className="bg-card border-l-4 border-gold p-4 rounded-r-lg shadow-sm space-y-1">
              <p className="text-xs uppercase tracking-wider text-gold font-semibold font-body">
                Our Parish Motto
              </p>
              <p className="font-display italic text-lg text-navy">
                "I can do all things through Christ who strengthens me."
              </p>
              <p className="text-xs text-muted-foreground font-body">
                Philippians 4:13 &bull; United in Christ, serving our community with love and compassion.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/leadership">
                <Button variant="navy" className="gap-2">
                  Meet Our Church Leaders
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/ministries">
                <Button variant="outline" className="border-navy text-navy hover:bg-navy/5">
                  Explore Parish Ministries
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VicarWelcomeSection;
