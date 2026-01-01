import TopInfoBar from "@/components/TopInfoBar";
import MainNavbar from "@/components/MainNavbar";
import { Users, Heart, Music, BookOpen, Baby, Leaf } from "lucide-react";

const ministries = [
  {
    name: "Men's Fellowship",
    description: "A community of men dedicated to spiritual growth, accountability, and service to God and family.",
    icon: Users,
  },
  {
    name: "Women's Guild",
    description: "Empowering women through fellowship, prayer, and community outreach programs.",
    icon: Heart,
  },
  {
    name: "Youth Ministry",
    description: "Engaging young people in faith, leadership development, and meaningful community service.",
    icon: Leaf,
  },
  {
    name: "Children's Ministry",
    description: "Nurturing the faith of our youngest members through age-appropriate teaching and activities.",
    icon: Baby,
  },
  {
    name: "Choir & Music Ministry",
    description: "Leading worship through music and song, glorifying God in every service.",
    icon: Music,
  },
  {
    name: "Bible Study Groups",
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
            {ministries.map((ministry, index) => (
              <div
                key={ministry.name}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <ministry.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">{ministry.name}</h3>
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
      <footer className="bg-navy text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/images/ack-diocese-logo.png" 
                  alt="A.C.K. Diocese of Thika Logo" 
                  className="h-12 w-auto"
                />
                <div>
                  <h3 className="font-display text-lg">A.C.K. St. Stephen's Church</h3>
                  <p className="text-sm text-primary-foreground/70">Gatuanyaga</p>
                </div>
              </div>
              <p className="text-sm text-primary-foreground/70 font-body">
                A.C.K. Diocese of Thika. United in Christ, serving our community with love and compassion.
              </p>
            </div>
            <div>
              <h4 className="font-display text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm font-body">
                <li><a href="/" className="hover:text-gold transition-colors">Home</a></li>
                <li><a href="/about" className="hover:text-gold transition-colors">About Us</a></li>
                <li><a href="/ministries" className="hover:text-gold transition-colors">Ministries</a></li>
                <li><a href="/events" className="hover:text-gold transition-colors">Events</a></li>
                <li><a href="/leadership" className="hover:text-gold transition-colors">Leadership</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-lg mb-4">Sunday Services</h4>
              <ul className="space-y-2 text-sm font-body text-primary-foreground/70">
                <li>7:00 AM - Express Service</li>
                <li>8:30 AM - English Service</li>
                <li>10:30 AM - Kikuyu Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-lg mb-4">Contact</h4>
              <ul className="space-y-2 text-sm font-body text-primary-foreground/70">
                <li>Gatuanyaga, Thika</li>
                <li>info@ackststephensgatuanyaga.org</li>
                <li>+254 XXX XXX XXX</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60 font-body">
            © {new Date().getFullYear()} A.C.K. St. Stephen's Church Gatuanyaga. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Ministries;
