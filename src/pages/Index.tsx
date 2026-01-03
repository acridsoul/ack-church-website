import TopInfoBar from "@/components/TopInfoBar";
import MainNavbar from "@/components/MainNavbar";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { Link } from "react-router-dom";

const featuredMinistries = [
  {
    name: "KAMA",
    subtitle: "Kenya Anglican Men's Association",
    description: "A community of men dedicated to spiritual growth and service.",
    logo: "/images/ministries/kama-logo.png",
  },
  {
    name: "Mothers Union",
    subtitle: "Christian Care for Families",
    description: "Empowering women through fellowship and outreach.",
    logo: "/images/ministries/mothers-union-logo.png",
  },
  {
    name: "KAYO",
    subtitle: "Youth Ministry",
    description: "Engaging young people in faith and leadership.",
    logo: "/images/ministries/kayo-logo.png",
  },
  {
    name: "Daughters of Zion",
    subtitle: "Choir & Music Ministry",
    description: "Leading worship through music and song.",
    icon: Music,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Info Bar */}
      <TopInfoBar />

      {/* Main Navigation */}
      <MainNavbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Ministries Preview Section */}
      <section id="content" className="py-16 md:py-24 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-center text-navy mb-4">
            Our <span className="text-gold italic">Ministries</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto font-body">
            There's a place for everyone to grow, serve, and connect at A.C.K. St. Stephen's Church.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMinistries.map((ministry) => (
              <div
                key={ministry.name}
                className="bg-card rounded-lg p-6 shadow-card hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-muted/50 transition-colors duration-300 overflow-hidden">
                  {ministry.logo ? (
                    <img src={ministry.logo} alt={`${ministry.name} logo`} className="w-14 h-14 object-contain" />
                  ) : ministry.icon ? (
                    <ministry.icon className="h-8 w-8 text-gold" />
                  ) : null}
                </div>
                <h3 className="font-display text-xl text-foreground mb-1">{ministry.name}</h3>
                {ministry.subtitle && (
                  <p className="text-gold text-xs font-medium mb-2">{ministry.subtitle}</p>
                )}
                <p className="text-muted-foreground text-sm mb-4 font-body">
                  {ministry.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/ministries">
              <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-primary-foreground">
                View All Ministries →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-4">
            Join Us This Sunday
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto font-body">
            Experience the warmth of our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="lg">
              Plan Your Visit
            </Button>
            <Button variant="goldOutline" size="lg">
              Watch Online
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark py-12 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/images/ack-diocese-logo.png" 
                  alt="A.C.K. Diocese of Thika Logo" 
                  className="h-12 w-auto"
                />
                <h3 className="font-display text-lg">A.C.K. St. Stephen's Church</h3>
              </div>
              <p className="text-primary-foreground/70 text-sm font-body">
                Gatuanyaga - A.C.K. Diocese of Thika. United in Christ, serving our community with love and compassion.
              </p>
              <p className="text-primary-foreground/60 text-xs font-body mt-2 italic">
                "I can do all things through Christ"
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gold font-body">Quick Links</h4>
              <ul className="space-y-2 text-sm font-body">
                <li><a href="/about" className="text-primary-foreground/70 hover:text-gold transition-colors">About Us</a></li>
                <li><a href="/leadership" className="text-primary-foreground/70 hover:text-gold transition-colors">Leadership</a></li>
                <li><a href="/events" className="text-primary-foreground/70 hover:text-gold transition-colors">Events</a></li>
                <li><a href="/contact" className="text-primary-foreground/70 hover:text-gold transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gold font-body">Sunday Service Times</h4>
              <ul className="space-y-2 text-sm font-body text-primary-foreground/70">
                <li>7:00 AM - Express Service</li>
                <li>8:30 AM - English Service</li>
                <li>10:30 AM - Kikuyu Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gold font-body">Contact Us</h4>
              <ul className="space-y-2 text-sm font-body text-primary-foreground/70">
                <li>Gatuanyaga, Kenya</li>
                <li>07xxxxxxxx</li>
                <li>ackststephenschurch@gmail.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/50 font-body">
            <p>© 2025 A.C.K. St. Stephen's Church Gatuanyaga. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
