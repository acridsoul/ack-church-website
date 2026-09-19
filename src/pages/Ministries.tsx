import TopInfoBar from "@/components/TopInfoBar";
import MainNavbar from "@/components/MainNavbar";
import SiteFooter from "@/components/SiteFooter";
import { Music, BookOpen, Baby } from "lucide-react";

const ministries = [
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
    description: "Engaging young people in faith, leadership development, and meaningful community service.",
    logo: "/images/ministries/kayo-logo.png",
  },
  {
    name: "Children's Ministry",
    subtitle: "",
    description: "Nurturing the faith of our youngest members through age-appropriate teaching and activities.",
    icon: Baby,
  },
  {
    name: "Daughters of Zion",
    subtitle: "Choir & Music Ministry",
    description: "Leading worship through music and song, glorifying God in every service.",
    icon: Music,
  },
  {
    name: "Bible Study Groups",
    subtitle: "",
    description: "Small groups dedicated to studying God's Word and growing together in faith.",
    icon: BookOpen,
  },
];

const Ministries = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopInfoBar />
      <MainNavbar />

      {/* Hero Section */}
      <section className="bg-navy py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-primary-foreground mb-4">
            Our <span className="text-gold italic">Ministries</span>
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto font-body">
            Discover the various ministries at A.C.K. St. Stephen's Church Gatuanyaga. 
            There's a place for everyone to grow, serve, and connect.
          </p>
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((ministry) => (
              <div
                key={ministry.name}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-muted/50 transition-colors overflow-hidden">
                  {ministry.logo ? (
                    <img src={ministry.logo} alt={`${ministry.name} logo`} className="w-14 h-14 object-contain" />
                  ) : ministry.icon ? (
                    <ministry.icon className="w-8 h-8 text-gold" />
                  ) : null}
                </div>
                <h3 className="font-display text-xl text-foreground mb-1">{ministry.name}</h3>
                {ministry.subtitle && (
                  <p className="text-gold text-xs font-medium mb-2">{ministry.subtitle}</p>
                )}
                <p className="text-muted-foreground font-body">{ministry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-cream py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl text-navy mb-4">Get Involved</h2>
          <p className="text-navy/70 max-w-xl mx-auto mb-8 font-body">
            Interested in joining a ministry? Contact us to learn more about how you can serve and grow with us.
          </p>
          <a
            href="mailto:info@ackststephensgatuanyaga.org"
            className="inline-block bg-navy text-primary-foreground px-8 py-3 rounded-md font-body hover:bg-navy/90 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
};

export default Ministries;
