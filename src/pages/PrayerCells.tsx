import TopInfoBar from "@/components/TopInfoBar";
import MainNavbar from "@/components/MainNavbar";
import { Users, Heart, Home, BookOpen, Cross, User } from "lucide-react";

const prayerCells = [
  {
    name: "Afilipi/Phillipians",
    icon: Users,
    description: "A prayer cell dedicated to fellowship and spiritual growth through prayer and study of God's Word.",
    leader: "Leader Name",
  },
  {
    name: "Athesalonike/Thessalonians",
    icon: Heart,
    description: "A community of believers committed to prayer, encouragement, and walking in faith together.",
    leader: "Leader Name",
  },
  {
    name: "Jerusalem",
    icon: Home,
    description: "A home-based prayer cell gathering regularly to seek God, intercede, and build Christian community.",
    leader: "Leader Name",
  },
  {
    name: "Macedonia",
    icon: BookOpen,
    description: "A prayer cell focused on studying Scripture, praying together, and supporting one another in faith.",
    leader: "Leader Name",
  },
  {
    name: "Berea",
    icon: Cross,
    description: "A prayer cell committed to examining the Scriptures daily, praying fervently, and growing in Christ.",
    leader: "Leader Name",
  },
];

const PrayerCells = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Info Bar */}
      <TopInfoBar />

      {/* Main Navigation */}
      <MainNavbar />

      {/* Hero Section */}
      <section className="bg-navy py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-primary-foreground mb-4">
            Prayer <span className="text-gold italic">Cells</span>
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto font-body">
            Join one of our prayer cells for fellowship, prayer, and spiritual growth in a smaller community setting.
          </p>
        </div>
      </section>

      {/* Prayer Cells Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prayerCells.map((cell) => (
              <div
                key={cell.name}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-muted/50 transition-colors">
                  <cell.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-1">{cell.name}</h3>
                <p className="text-muted-foreground font-body mb-4">{cell.description}</p>
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gold flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-body mb-1">
                        Leader
                      </p>
                      <p className="text-sm font-body font-medium text-foreground">
                        {cell.leader}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                <li><a href="/" className="text-primary-foreground/70 hover:text-gold transition-colors">Home</a></li>
                <li><a href="/about" className="text-primary-foreground/70 hover:text-gold transition-colors">About Us</a></li>
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

export default PrayerCells;

