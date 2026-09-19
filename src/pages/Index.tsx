import TopInfoBar from "@/components/TopInfoBar";
import MainNavbar from "@/components/MainNavbar";
import HeroSection from "@/components/HeroSection";
import SundayServicesSection from "@/components/SundayServicesSection";
import VicarWelcomeSection from "@/components/VicarWelcomeSection";
import LatestSermonSpotlight from "@/components/LatestSermonSpotlight";
import { Button } from "@/components/ui/button";
import { 
  Music, 
  BookOpen, 
  Baby, 
  Users, 
  Home, 
  Cross, 
  Heart, 
  ArrowRight, 
  HandHeart, 
  Sparkles,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";

const featuredMinistries = [
  {
    name: "KAMA",
    subtitle: "Kenya Anglican Men's Association",
    description: "A community of men dedicated to spiritual growth, accountability, and service to God and family.",
    logo: "/images/ministries/kama-logo.png",
  },
  {
    name: "Mothers Union",
    subtitle: "Christian Care for Families",
    description: "Empowering women through fellowship, prayer, and community outreach programs.",
    logo: "/images/ministries/mothers-union-logo.png",
  },
  {
    name: "KAYO",
    subtitle: "Youth Ministry",
    description: "Engaging young people in faith, leadership development, and active service in God's kingdom.",
    logo: "/images/ministries/kayo-logo.png",
  },
  {
    name: "Children's Ministry",
    subtitle: "Sunday School",
    description: "Nurturing the faith of our youngest members through age-appropriate biblical teaching.",
    icon: Baby,
  },
  {
    name: "Daughters of Zion",
    subtitle: "Choir & Music Ministry",
    description: "Leading worship through music and choral praise in all Sunday services.",
    icon: Music,
  },
  {
    name: "Bible Study Groups",
    subtitle: "Midweek Discipleship",
    description: "Small groups dedicated to in-depth study of God's Word and growing together.",
    icon: BookOpen,
  },
];

const prayerCellsList = [
  { name: "Afilipi / Phillipians", icon: Users, focus: "Fellowship & Scripture Study" },
  { name: "Athesalonike / Thessalonians", icon: Heart, focus: "Prayer & Encouragement" },
  { name: "Jerusalem", icon: Home, focus: "Home Intercession & Fellowship" },
  { name: "Macedonia", icon: BookOpen, focus: "Scripture Study & Support" },
  { name: "Berea", icon: Cross, focus: "Daily Scripture Examination & Prayer" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 1. Top Contact & Social Bar */}
      <TopInfoBar />

      {/* 2. Main Navigation Bar */}
      <MainNavbar />

      {/* 3. High-Impact Visitor Hero */}
      <HeroSection />

      {/* 4. Sunday Service Times Schedule (Visitor-First) */}
      <SundayServicesSection />

      {/* 5. Vicar's Welcome & Pastoral Word */}
      <VicarWelcomeSection />

      {/* 6. Dynamic Latest Sermon Spotlight */}
      <LatestSermonSpotlight />

      {/* 7. Ministries & Fellowships Grid */}
      <section id="ministries" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 text-gold text-xs md:text-sm font-semibold tracking-wide uppercase font-body mb-4">
              <Users className="w-3.5 h-3.5 text-gold" />
              Community &amp; Fellowships
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-navy mb-4 font-bold">
              Our <span className="text-gold italic">Ministries</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg font-body leading-relaxed">
              There is a vibrant place for everyone to belong, grow spiritually, and serve at A.C.K. St. Stephen's Church Gatuanyaga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredMinistries.map((ministry) => {
              const Icon = ministry.icon;
              return (
                <div
                  key={ministry.name}
                  className="bg-card border border-border rounded-xl p-6 shadow-card hover:shadow-xl hover:border-gold/50 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-16 h-16 bg-cream rounded-xl flex items-center justify-center mb-5 group-hover:bg-gold/15 transition-colors duration-300 overflow-hidden border border-border/50">
                      {ministry.logo ? (
                        <img
                          src={ministry.logo}
                          alt={`${ministry.name} logo`}
                          className="w-12 h-12 object-contain"
                        />
                      ) : Icon ? (
                        <Icon className="h-8 w-8 text-gold" />
                      ) : null}
                    </div>

                    <h3 className="font-display text-2xl font-bold text-foreground mb-1 group-hover:text-navy transition-colors">
                      {ministry.name}
                    </h3>

                    {ministry.subtitle && (
                      <p className="text-gold text-xs font-semibold uppercase tracking-wider mb-3 font-body">
                        {ministry.subtitle}
                      </p>
                    )}

                    <p className="text-muted-foreground text-sm md:text-base font-body leading-relaxed">
                      {ministry.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-border">
                    <Link
                      to="/ministries"
                      className="inline-flex items-center text-xs md:text-sm font-semibold text-navy hover:text-gold transition-colors font-body gap-1.5"
                    >
                      Learn More About {ministry.name}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link to="/ministries">
              <Button variant="outline" size="lg" className="border-navy text-navy hover:bg-navy hover:text-primary-foreground">
                View All Ministries &amp; Get Involved &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Kanisa Mashinani (Home Prayer Cells) Showcase */}
      <section id="prayer-cells" className="py-16 md:py-20 bg-cream border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy/10 text-navy text-xs md:text-sm font-semibold tracking-wide uppercase font-body mb-4">
              <Home className="w-3.5 h-3.5 text-gold" />
              Kanisa Mashinani
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-navy mb-4 font-bold">
              Faith in the <span className="text-gold italic">Neighborhood</span>
            </h2>
            <p className="text-foreground/80 text-base md:text-lg font-body leading-relaxed">
              Church life does not end on Sunday. Our parish gathers mid-week in 5 home prayer cells across Gatuanyaga for mutual intercession, practical care, and Bible study.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {prayerCellsList.map((cell) => {
              const Icon = cell.icon;
              return (
                <div
                  key={cell.name}
                  className="bg-card border border-border/80 rounded-xl p-5 text-center hover:border-gold hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-gold/15 rounded-full flex items-center justify-center text-navy">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <h4 className="font-display font-bold text-base text-navy mb-1">
                    {cell.name}
                  </h4>
                  <p className="text-xs text-muted-foreground font-body">
                    {cell.focus}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link to="/prayer-cells">
              <Button variant="navy" className="gap-2">
                Find Your Local Prayer Cell
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Stewardship & Parish Giving Section */}
      <section id="giving" className="py-16 md:py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-navy text-primary-foreground rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-gold/20 flex items-center justify-center">
                <HandHeart className="w-6 h-6 text-gold" />
              </div>

              <h2 className="font-display text-2xl md:text-4xl font-bold">
                Supporting God's Work &amp; Community Mission
              </h2>

              <p className="text-gold italic font-body text-sm md:text-base max-w-xl mx-auto">
                "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                <span className="block text-primary-foreground/75 font-normal text-xs mt-1">— 2 Corinthians 9:7</span>
              </p>

              <p className="text-primary-foreground/80 font-body text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                Your tithes, offerings, and development contributions sustain our weekly worship, pastoral outreach, and ongoing church building projects.
              </p>

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <a href="tel:+254-7xxxxxxxx">
                  <Button variant="gold" size="lg" className="shadow-lg hover-gold-glow">
                    Parish Giving Inquiries
                  </Button>
                </a>
                <a href="mailto:ackststephenschurch@gmail.com">
                  <Button variant="goldOutline" size="lg">
                    Contact Church Office
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Comprehensive Footer */}
      <footer className="bg-navy-dark py-14 text-primary-foreground border-t border-navy-light/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Church Branding */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/images/ack-diocese-logo.png"
                  alt="A.C.K. Diocese of Thika Logo"
                  className="h-12 w-auto object-contain"
                />
                <div>
                  <h3 className="font-display text-lg font-bold">A.C.K. St. Stephen's Church</h3>
                  <p className="text-xs text-gold">Gatuanyaga &bull; Diocese of Thika</p>
                </div>
              </div>
              <p className="text-primary-foreground/75 text-sm font-body leading-relaxed mb-3">
                United in Christ, serving our community with love and compassion.
              </p>
              <p className="text-gold/90 text-xs font-body italic">
                "I can do all things through Christ" (Phil 4:13)
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-gold font-body tracking-wider uppercase text-xs">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-sm font-body">
                <li>
                  <Link to="/" className="text-primary-foreground/75 hover:text-gold transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/sermons" className="text-primary-foreground/75 hover:text-gold transition-colors">
                    Sermon Notes Archive
                  </Link>
                </li>
                <li>
                  <Link to="/leadership" className="text-primary-foreground/75 hover:text-gold transition-colors">
                    Clergy &amp; Lay Leadership
                  </Link>
                </li>
                <li>
                  <Link to="/ministries" className="text-primary-foreground/75 hover:text-gold transition-colors">
                    Parish Ministries
                  </Link>
                </li>
                <li>
                  <Link to="/prayer-cells" className="text-primary-foreground/75 hover:text-gold transition-colors">
                    Kanisa Mashinani (Prayer Cells)
                  </Link>
                </li>
                <li>
                  <Link to="/notices-announcements" className="text-primary-foreground/75 hover:text-gold transition-colors">
                    Notices &amp; Announcements
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sunday Service Times */}
            <div>
              <h4 className="font-semibold mb-4 text-gold font-body tracking-wider uppercase text-xs">
                Sunday Service Times
              </h4>
              <ul className="space-y-3 text-sm font-body text-primary-foreground/75">
                <li className="border-b border-primary-foreground/10 pb-2">
                  <span className="font-semibold text-primary-foreground block">7:00 AM – 8:15 AM</span>
                  <span className="text-xs text-gold">Express Service (Communion)</span>
                </li>
                <li className="border-b border-primary-foreground/10 pb-2">
                  <span className="font-semibold text-primary-foreground block">8:30 AM – 10:15 AM</span>
                  <span className="text-xs text-gold">English Service (Family &amp; Youth)</span>
                </li>
                <li>
                  <span className="font-semibold text-primary-foreground block">10:30 AM – 12:30 PM</span>
                  <span className="text-xs text-gold">Kikuyu Service (Gĩkũyũ Liturgy)</span>
                </li>
              </ul>
            </div>

            {/* Contact Details */}
            <div>
              <h4 className="font-semibold mb-4 text-gold font-body tracking-wider uppercase text-xs">
                Contact &amp; Location
              </h4>
              <ul className="space-y-3 text-sm font-body text-primary-foreground/75">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>Gatuanyaga, Thika, Kenya</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                  <a href="tel:+254-7xxxxxxxx" className="hover:text-gold transition-colors">
                    07xxxxxxxx
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                  <a href="mailto:ackststephenschurch@gmail.com" className="hover:text-gold transition-colors break-all">
                    ackststephenschurch@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/15 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/50 font-body">
            <p>&copy; {new Date().getFullYear()} A.C.K. St. Stephen's Church Gatuanyaga. All rights reserved.</p>
            <p>Diocese of Thika &bull; Anglican Church of Kenya</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
